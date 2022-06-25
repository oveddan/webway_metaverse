import { SceneConfiguration } from "../Config/types/scene";
import { Environment as DreiEnvironment } from "@react-three/drei";

const Environment = ({
  environment,
}: Pick<SceneConfiguration, "environment">) => {
  if (!environment) return null;

  if (!environment.fileUrl || !environment.fileUrl) return null;

  return <DreiEnvironment files={environment.fileUrl} background />;
};

export default Environment;
