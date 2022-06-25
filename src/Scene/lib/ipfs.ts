import { useEffect, useState } from "react";
import { Nullable } from "../Config/types/shared";

const nftStorageGateway = "https://nftstorage.link/ipfs";
const localStorageGateway = "http://127.0.0.1:8080/ipfs";
const ipfsGateway = "https://ipfs.io/ipfs";
function convertURIToHTTPSInner({
  url,
  ipfsHost = ipfsGateway ,
}: {
  url: string | undefined;
  ipfsHost?: string;
}) {
  if (!url) return undefined;
  if (url.startsWith("ipfs.io")) {
    return url.replace("ipfs.io", `${ipfsHost}`);
  }
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", `${ipfsHost}/ipfs/`);
  }
  return url;
}

export function convertURIToHTTPS(args: {
  url: string | undefined;
  ipfsHost?: string;
}) {
  const result = convertURIToHTTPSInner(args);

  if (!result)
    throw new Error(`missing result, inputs were, ${JSON.stringify(args)}`);

  return result;
}

export const useHttpsUriForIpfs = (ipfsUrl?: Nullable<string>) => {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!ipfsUrl) {
      setResult(null);
      return;
    }

    setResult(convertURIToHTTPS({ url: ipfsUrl }));
  }, [ipfsUrl]);

  return result;
};
