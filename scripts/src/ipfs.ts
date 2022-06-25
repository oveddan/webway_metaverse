import {
  CID,
  create,
  globSource,
  IPFSHTTPClient,
  Options,
  urlSource,
} from "ipfs-http-client";
import chalk from "chalk";
import { clearLine } from "readline";
import { SceneConfiguration } from "../../src/Scene/Config/types/scene";
import {
  Element,
  ElementNodes,
  ElementType,
} from "../../src/Scene/Config/types/elements";
import marbleScene from "../../src/Scene/Config/marbleScene";
import temp from "temp";
import http from "https"; // or 'https' for https:// URLs
import fs from "fs";

temp.track();

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
const localhost = { host: "127.0.0.1", port: 5002, protocol: "http" };

const pinata: Options = {
  host: "api.pinata.cloud",
  apiPath: "psa",
  port: 443,
  protocol: "https",
  headers: {
    Authorization: `Bearer ${process.env.PINATA_JWT}`,
  },
};

const ipfs = create(localhost);

const ipfsGateway = "https://ipfs.io/ipfs/";
// const pinataGateway = 'https://landa.mypinata.cloud';
const ipnsGateway = "https://ipfs.io/ipns/";

const addOptions = {
  pin: true,
  wrapWithDirectory: true,
};

const downloadTempFile = async (remoteUrl: string) => {
  const tempLocation = await temp.open("tempFile");
  const file = fs.createWriteStream(tempLocation.path);

  return new Promise<string>((resolve, reject) => {
    http.get(remoteUrl, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");

        resolve(tempLocation.path);
      });
    });
  });
};

const toIpfsAddress = (cid: CID) => `ipfs.io/${cid.toString()}`;

const publishFile = async (url: string) => {
  console.log("publishing file", url);
  // const tempFile = await downloadTempFile(url)
  const urlS = urlSource(url);
  // @ts-ignore
  const result = await ipfs.add(urlS);

  return toIpfsAddress(result.cid);
};

const publishElementsToIps = async (elements: ElementNodes) => {
  const result = await Promise.all(
    Object.entries(elements).map(async ([key, element]) => {
      const children = element.children
        ? await publishElementsToIps(element.children)
        : undefined;
      if (element.elementType === ElementType.Model) {
        return {
          ...element,
          children,
          modelConfig: {
            ...element.modelConfig,
            fileUrl: element.modelConfig.fileUrl
              ? await publishFile(element.modelConfig.fileUrl)
              : undefined,
          },
        };
      }

      return {
        key,
        element: {
          ...element,
          children,
        },
      };
    })
  );

  return result.reduce((acc: ElementNodes, { key, element }) => {
    return {
      ...acc,
      [key]: element,
    };
  }, {});
};

const publishFilesInGraphToIpfs = async (
  config: SceneConfiguration
): Promise<SceneConfiguration> => {
  return {
    environment: {
      fileUrl: config.environment?.fileUrl
        ? await publishFile(config.environment.fileUrl)
        : undefined,
    },
    elements: config.elements
      ? await publishElementsToIps(config.elements)
      : undefined,
    availableMods: config.availableMods,
  };
};

const publishConfigToIpfs = async (config: SceneConfiguration) => {
  const withFileOnIpFs = await publishFilesInGraphToIpfs(config);

  // console.log(require('util').inspect(withFileOnIpFs, {depth: null}));=

  const configIpfsUrl = await ipfs.add(JSON.stringify(withFileOnIpFs, null, 2));

  return toIpfsAddress(configIpfsUrl.cid);
};

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

export interface Erc721Token {
  name: string;
  description?: string;
  animation_url: string;
  scene_config: SceneConfiguration;
}

const publishNft = async ({
  name,
  sceneConfig,
}: {
  name: string;
  sceneConfig: SceneConfiguration;
}) => {
  const configJson = await publishFilesInGraphToIpfs(sceneConfig);

  const tokenMetadata: Erc721Token = {
    name,
    animation_url: "",
    scene_config: configJson,
  };

  const tokenIpfsCif = await ipfs.add(JSON.stringify(tokenMetadata, null, 2));

  const tokenIpfsCifUrl = toIpfsAddress(tokenIpfsCif.cid);
  console.log("published to:", tokenIpfsCifUrl);
};

publishNft({
  sceneConfig: marbleScene,
  name: "marble scene",
});
