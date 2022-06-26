import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "../shared/ErrorBoundary";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";

import { SceneConfiguration } from "./Config/types/scene";
import ModificationControls from "../UI/ModificationControls";
import useApplyModifications from "./Config/useApplyModifications";
import { ModificationsWithStatus } from "./Config/types/modifications";
import { useCallback, useState } from "react";
import { SceneContext } from "./SceneContext";

const SceneRenderer = ({
  loading,
  valid,
  scene,
  canAlwaysModify,
  tokenId,
  toggleApplied,
  modifications,
}: {
  loading: boolean;
  valid?: boolean;
  scene?: SceneConfiguration;
  modifications: ModificationsWithStatus;
  toggleApplied: (key: string) => void;
  canAlwaysModify?: boolean;
  tokenId?: string;
}) => {
  const sceneWithMods = useApplyModifications({
    scene,
    modifications,
  });

  const [hasClicked, setHasClicked] = useState(false);

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);
  }, [hasClicked]);

  if (loading || !sceneWithMods) return <h1>loading...</h1>;

  if (!valid) return <h1>Invalid token id</h1>;

  return (
    <>
      <Canvas onClick={onClicked}>
        <SceneContext.Provider value={{ hasClicked }}>
          <ErrorBoundary>
            {scene && (
              <>
                <Environment environment={sceneWithMods.environment} />
                <ElementsTree elements={sceneWithMods.elements} />
              </>
            )}
            <Controls />
          </ErrorBoundary>
        </SceneContext.Provider>
      </Canvas>
      <ModificationControls
        toggleApplied={toggleApplied}
        modifications={modifications}
        canAlwaysModify={canAlwaysModify}
        tokenId={tokenId}
      />
    </>
  );
};

export default SceneRenderer;
