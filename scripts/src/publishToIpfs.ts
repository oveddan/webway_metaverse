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
import marbleScene, {
  marbleSceneMods,
} from "../../src/Scene/Config/marbleScene";
import temp from "temp";
import http from "https"; // or 'https' for https:// URLs
import fs from "fs";
import { AvailableModifications } from "../../src/Scene/Config/types/modifications";
import "dotenv/config";
import { NFTStorage, File, CIDString } from "nft.storage";
import path from "path";
import mime from "mime";

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

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

const nftStorage = new NFTStorage({ token: NFT_STORAGE_KEY });

const pinata: Options = {
  host: "api.pinata.cloud",
  apiPath: "psa",
  port: 443,
  protocol: "https",
  headers: {
    Authorization: `Bearer ${process.env.PINATA_JWT}`,
  },
};

const nftStorageParams: Options = {
  host: "api.nft.storage",
  apiPath: "pins",
  port: 443,
  protocol: "https",
  headers: {
    Authorization: `Bearer ${NFT_STORAGE_KEY}`,
    ["Content-Type"]: "application/json",
    Accept: "*/*",
  },
};

const ipfs = create(nftStorageParams);

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

const saveTempFileString = async (contents: string) => {
  const tempLocation = await temp.open("tempFile");

  await fs.promises.writeFile(tempLocation.path, contents);

  console.log('wrote to', tempLocation.path)

  return tempLocation.path;

}

const publishFileUsingIpfsPost = async (url: string) => {
  console.log("publishing file", url);
  // const tempFile = await downloadTempFile(url)
  const urlS = urlSource(url);
  // @ts-ignore
  const result = await ipfs.add(urlS);

  return toIpfsAddress(result.cid);
};

const publishBlobToNftStorage = async (url: string) => {
  const filePath = await downloadTempFile(url);

  const file = await fileFromPath(filePath);

  
  const cid = await nftStorage.storeBlob(file);

  // @ts-ignore
  return toIpfsAddress(cid);
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  // @ts-ignore
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

const toIpfsAddress = (cid: CID | CIDString) => `ipfs://${cid.toString()}`;

const publishElementsToIps = async (elements: ElementNodes) => {
  const result = await Promise.all(
    Object.entries(elements).map(async ([key, element]) => {
      const children = element.children
        ? await publishElementsToIps(element.children)
        : undefined;
      if (element.elementType === ElementType.Model) {
        return {
          key,
          element: {
            ...element,
            children,
            modelConfig: {
              ...element.modelConfig,
              fileUrl: element.modelConfig.fileUrl
                ? await publishBlobToNftStorage (element.modelConfig.fileUrl)
                : undefined,
            },
          },
        };
      }

      if (element.elementType === ElementType.Image) {
        const { imageConfig } = element;
        return {
          key,
          element: {
            ...element,
            children,
            imageConfig: {
              ...imageConfig,
              fileUrl: imageConfig.fileUrl
                ? await publishBlobToNftStorage (imageConfig.fileUrl)
                : undefined,
            },
          },
        };
      }

      if (element.elementType === ElementType.Video) {
        const { videoConfig } = element;
        return {
          key,
          element: {
            ...element,
            children,
            videoConfig: {
              ...videoConfig,
              file: {
                originalUrl: videoConfig?.file?.originalUrl
                  ? await publishBlobToNftStorage (videoConfig.file.originalUrl)
                  : undefined,
              },
            },
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
        ? await publishBlobToNftStorage(config.environment.fileUrl)
        : undefined,
    },
    elements: config.elements
      ? await publishElementsToIps(config.elements)
      : undefined,
  };
};

const publishJsonToIpfs = async (json: object) => {
       const storedJsonPath = await saveTempFileString(JSON.stringify(json));
      const file = await fileFromPath(storedJsonPath);
      // file.type = 'text/json';
      // const file =new Blob([JSON.stringify(json)], {
      //   type: 'text/json'
      // });
      const modIpfsCid = await nftStorage.storeBlob(file );

      return modIpfsCid;

      

}

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

export interface Erc721Token {
  name: string;
  description?: string;
  animation_url: string;
  scene_config: SceneConfiguration;
}

const publishToken = async ({
  name,
  sceneConfig,
}: {
  name: string;
  sceneConfig: SceneConfiguration;
}) => {
  const configJson = await publishFilesInGraphToIpfs(sceneConfig);

  console.log({
    configJson,
    sceneConfig,
  });

  const tokenMetadata: Erc721Token = {
    name,
    animation_url: "",
    scene_config: configJson,
  };

  const tokenIpfsCif = await publishJsonToIpfs(tokenMetadata);
  // const tokenIpfsCif = await ipfs.add(JSON.stringify(tokenMetadata, null, 2));

  console.log('published token:');

  console.log(JSON.stringify(tokenMetadata, null, 2));

  // @ts-ignore
  const tokenIpfsCifUrl = toIpfsAddress(tokenIpfsCif);
  console.log("token ipfs address:", tokenIpfsCifUrl);
};

const publishNft = async ({
  name,
  sceneConfig,
  availableMods,
}: {
  name: string;
  sceneConfig: SceneConfiguration;
  availableMods: AvailableModifications;
}) => {
  
  await publishToken({ name, sceneConfig });

  console.log('token published');

  await Promise.all(
    Object.entries(availableMods).map(async ([key, mod]) => {
      const modIpfsCid = await publishJsonToIpfs(mod);

      const modIpfsCifUrl = toIpfsAddress(modIpfsCid);
      console.log("mod ipfs address:", key, modIpfsCifUrl);
    })
  );
};

publishNft({
  sceneConfig: marbleScene,
  availableMods: marbleSceneMods,
  name: "marble scene",
});
