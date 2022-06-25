import { useParams } from "react-router-dom";
import { useTokenScene } from "./lib/queries";
import SceneRenderer from "./SceneRenderer";

const TokenScene = () => {
  const { tokenId } = useParams<{
    tokenId: string;
  }>();

  const tokenScene = useTokenScene(tokenId);

  return <SceneRenderer {...tokenScene} />;
};

export default TokenScene;
