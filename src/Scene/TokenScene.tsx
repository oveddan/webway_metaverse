import { useParams } from "react-router-dom";
import Profile from "../web3/Profile";
import { useActiveEffects, useTokenScene } from "./lib/queries";
import SceneRenderer from "./SceneRenderer";

const TokenScene = () => {
  const { tokenId } = useParams<{
    tokenId: string;
  }>();

  const tokenScene = useTokenScene(tokenId);

  const tokenEffects = useActiveEffects(tokenId);

  return (
    <>
      <Profile />
      <SceneRenderer {...tokenScene} tokenId={tokenId} />
    </>
  );
};

export default TokenScene;
