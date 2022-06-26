import { Image } from "@react-three/drei";
import { ImageConfig } from "../Config/types/elements";
import { useHttpsUriForIpfs } from "../lib/ipfs";

const ImageElement = ({ config }: { config: ImageConfig }) => {
  const fileUrl = useHttpsUriForIpfs(config?.fileUrl);

  if (!fileUrl) return null;

  return <Image url={fileUrl} />;
};

export default ImageElement;
