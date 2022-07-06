import { ModelConfig } from "../Config/types/elements";
import { Nullable } from "../Config/types/shared";
import { useGLTF } from "@react-three/drei";
import { useHttpsUriForIpfs } from "../lib/ipfs";

const ModelElementInner = ({ fileUrl }: { fileUrl: string }) => {
  const model = useGLTF(fileUrl, true);

  return <primitive object={model.scene} />;
};

const ModelElement = ({ config }: { config?: Nullable<ModelConfig> }) => {
  const fileUrl = useHttpsUriForIpfs(config?.fileUrl);

  console.log(

    {modelFile: fileUrl}
  );

  if (!fileUrl) return null;

  return <ModelElementInner fileUrl={fileUrl} />;
};

export default ModelElement;
