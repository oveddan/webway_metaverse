import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "../shared/ErrorBoundary";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";

import { SceneConfiguration } from "./Config/types/scene";
import { useCallback, useState } from "react";

const SceneRenderer = ({
  loading,
  valid,
  scene,
canModify
}: {
  loading: boolean;
  valid?: boolean;
  scene?: SceneConfiguration;
canModify?: boolean;
}) => {
  if (loading) return <h1>loading...</h1>;

  if (!valid) return <h1>Invalid token id</h1>;

  const [appliedModification, setAppliedModifications] = useState<
    {
      [key: string]: {
        applied: boolean,
        processing: boolean,
      error: boolean
      }
    }
  >({})

  const updateModification = useCallback((key: string, apply: boolean) => {
    setAppliedModifications(existing => {
      const existingApplied = existing[key];

      if (existingApplied?.processing) return existing;
    
      return {
        ...existing,
        [key]: {
          applied: apply,
          processing: false,
          error: false
        }
      }
    })
  }, []);

  return (
    <>
    <Canvas>
      <ErrorBoundary>
        {scene && (
          <>
            <Environment environment={scene.environment} />
            <ElementsTree elements={scene.elements} />
          </>
        )}
        <Controls />
      </ErrorBoundary>
    </Canvas>
    {canModify && <Modifications update={updateModification} applied={appliedModification} modifications={scene?.availableMods}/>
  </>
  );
};

export default SceneRenderer;
