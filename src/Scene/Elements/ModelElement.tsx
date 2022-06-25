import { ModelConfig } from "../Config/types/elements";
import { Nullable } from "../Config/types/shared";
import { useGLTF } from "@react-three/drei";

const ModelElementInner = ({ fileUrl }: { fileUrl: string }) => {
  const model = useGLTF(fileUrl, true);

  return <primitive object={model.scene} />;
};

const ModelElement = ({ config }: { config?: Nullable<ModelConfig> }) => {
  if (!config) return null;

  if (!config.fileUrl) return null;

  return <ModelElementInner fileUrl={config.fileUrl} />;
};

export default ModelElement;
