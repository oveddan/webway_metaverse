import { CID, create, globSource, IPFSHTTPClient } from "ipfs-http-client";
import chalk from "chalk";
import { clearLine } from "readline";
import { SceneConfiguration } from "../src/Scene/Config/types/scene";
import marbleScene from "../src/Scene/Config/marbleScene";

interface AddResult {
  cid: CID;
  size: number;
  path: string;
  mode?: number;
  // @ts-ignore
  mtime?: Mtime;
}

const infura = { host: "ipfs.infura.io", port: 5001, protocol: "https" };
// run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
// const localhost = { host: "localhost", port: "5001", protocol: "http" };

const ipfs = create(infura);

const ipfsGateway = "https://ipfs.io/ipfs/";
const ipnsGateway = "https://ipfs.io/ipns/";

const addOptions = {
  pin: true,
  wrapWithDirectory: true,
};

const publishConfigToIpfs = async (config: SceneConfiguration) => {};

export const pushDirectoryToIPFS = async (path: string) => {
  const file = ipfs.addAll(globSource(path, "**/*"), addOptions);

  const resp: AddResult[] = [];
  for await (const f of file) {
    resp.push(f);
  }
  return resp;
};

const publishHashToIPNS = async (ipfsHash: string) => {
  const response = await ipfs.name.publish(`/ipfs/${ipfsHash}`);
  return response;
};

const nodeMayAllowPublish = (ipfsClient: IPFSHTTPClient) => {
  // You must have your own IPFS node in order to publish an IPNS name
  // This contains a blacklist of known nodes which do not allow users to publish IPNS names.
  const nonPublishingNodes = ["ipfs.infura.io"];
  const { host } = ipfsClient.getEndpointConfig();
  return !nonPublishingNodes.some((nodeUrl) => host.includes(nodeUrl));
};

export const deploy = async () => {
  console.log("🛰  Sending to IPFS...");
  const results = await pushDirectoryToIPFS("./build");
  if (results.length === 0) {
    console.log(`📡 App deployment failed`);
    return false;
  }

  const cid = results[results.length - 1].cid;
  console.log(
    `📡 App deployed to IPFS with hash: ${chalk.cyan(cid.toString())}`
  );

  console.log();

  let ipnsName = "";
  if (nodeMayAllowPublish(ipfs)) {
    console.log(`✍️  Publishing /ipfs/${cid.toString()} to IPNS...`);
    process.stdout.write(
      "   Publishing to IPNS can take up to roughly two minutes.\r"
    );
    ipnsName = (await publishHashToIPNS(cid.toString())).name;
    clearLine(process.stdout, 0);
    if (!ipnsName) {
      console.log("   Publishing IPNS name on node failed.");
    }
    console.log(`🔖 App published to IPNS with name: ${chalk.cyan(ipnsName)}`);
    console.log();
  }

  console.log("🚀 Deployment to IPFS complete!");
  console.log();

  console.log(`Use the link${ipnsName && "s"} below to access your app:`);
  console.log(`   IPFS: ${chalk.cyan(`${ipfsGateway}${cid.toString()}`)}`);
  if (ipnsName) {
    console.log(`   IPNS: ${chalk.cyan(`${ipnsGateway}${ipnsName}`)}`);
    console.log();
    console.log(
      "Each new deployment will have a unique IPFS hash while the IPNS name will always point at the most recent deployment."
    );
    console.log(
      "It is recommended that you share the IPNS link so that people always see the newest version of your app."
    );
  }
  console.log();
  return true;
};

const publishNft = async () => {
  await publishConfigToIpfs(marbleScene);
};

publishNft();

// deploy();
