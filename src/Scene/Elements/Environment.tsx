import { SceneConfiguration } from "../Config/types/scene";
import { Environment as DreiEnvironment } from "@react-three/drei";
import { useHttpsUriForIpfs } from "../lib/ipfs";

const Environment = ({
  environment,
}: Pick<SceneConfiguration, "environment">) => {
  const fileUrl = useHttpsUriForIpfs(environment?.fileUrl);

  if (!fileUrl) return null;

  return <DreiEnvironment files={fileUrl} background />;
};

export default Environment;
