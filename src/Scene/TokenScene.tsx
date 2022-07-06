import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToggleEffectContract } from "../web3/contract";
import Profile from "../web3/Profile";
import { ModificationsWithStatus } from "./Config/types/modifications";
import { useActiveEffects, useTokenScene } from "./lib/queries";
import SceneRenderer from "./SceneRenderer";

const TokenScene = () => {
  const { tokenId } = useParams<{
    tokenId: string;
  }>();

  const tokenScene = useTokenScene(tokenId);

  const tokenEffects = useActiveEffects(tokenId);

  // @ts-ignore
  const { toggleEffect, applied } = useToggleEffectContract();

  const [modifications, setModifications] = useState<ModificationsWithStatus>(
    {}
  );

  useEffect(() => {
    if (!tokenEffects) {
      setModifications({});
      return;
    }
    const combined = Object.entries(tokenEffects).reduce(
      (acc: ModificationsWithStatus, [key, tokenEffect]) => {
        // return {
        //   ...acc,
        //   [key]: {
        //   }

        const appliedOfKey = applied[key];

        const result: ModificationsWithStatus = {
          ...acc,
          [key]: {
            modification: tokenEffect.modification,
            applied: {
              applied: tokenEffect.active,
              processing: !!appliedOfKey?.processing,
              error: !!appliedOfKey?.error,
            },
          },
        };

        return result;
      },
      {}
    );

    setModifications(combined);
  }, [tokenEffects, applied]);

  return (
    <>
      <SceneRenderer
        {...tokenScene}
        modifications={modifications}
        toggleApplied={toggleEffect}
        tokenId={tokenId}
      />
    </>
  );
};

export default TokenScene;
