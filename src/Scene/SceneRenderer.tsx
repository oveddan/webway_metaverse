import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "../shared/ErrorBoundary";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";

import { SceneConfiguration } from "./Config/types/scene";
import ModificationControls from "../UI/ModificationControls";
import useApplyModifications from "./Config/useApplyModifications";
import { ModificationsWithStatus } from "./Config/types/modifications";
import { useCallback, useEffect, useState } from "react";
import { SceneContext } from "./SceneContext";
import { AudioListener } from "three";

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

  const [listener, setListener] = useState<AudioListener>();

  const onClicked = useCallback(() => {
    if (hasClicked) return;
    setHasClicked(true);

    setListener(new AudioListener());
  }, [hasClicked]);

  if (loading || !sceneWithMods) return <h1>loading...</h1>;

  if (!valid) return <h1>Invalid token id</h1>;

  return (
    <>
      <ErrorBoundary>
        <Canvas>
          <mesh>
            <boxBufferGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </Canvas>
      </ErrorBoundary>
    </>
  );
};

export default SceneRenderer;
