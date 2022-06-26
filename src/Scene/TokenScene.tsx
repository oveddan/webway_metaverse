import { useParams } from "react-router-dom";
import Profile from "../web3/Profile";
import { useTokenScene } from "./lib/queries";
import SceneRenderer from "./SceneRenderer";

const TokenScene = () => {
  const { tokenId } = useParams<{
    tokenId: string;
  }>();

  const tokenScene = useTokenScene(tokenId);

  return (
    <>
      <Profile />
      <SceneRenderer {...tokenScene} tokenId={tokenId} />
    </>
  );
};

export default TokenScene;
