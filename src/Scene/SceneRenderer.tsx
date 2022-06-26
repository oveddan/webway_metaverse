import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "../shared/ErrorBoundary";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";

import { SceneConfiguration } from "./Config/types/scene";
import { useCallback, useEffect, useState } from "react";
import ModificationControls, {
  AppliedModifications,
} from "../UI/ModificationControls";
import useApplyModifications from "./Config/useApplyModifications";
import { AvailableModifications } from "./Config/types/modifications";

const SceneRenderer = ({
  loading,
  valid,
  scene,
  canAlwaysModify,
  tokenId,
  availableModifications,
}: {
  loading: boolean;
  valid?: boolean;
  scene?: SceneConfiguration;
  availableModifications?: AvailableModifications;
  canAlwaysModify?: boolean;
  tokenId?: string;
}) => {
  const [appliedModification, setAppliedModifications] =
    useState<AppliedModifications>({});

  const toggleApplied = useCallback((key: string) => {
    setAppliedModifications((existing) => {
      const existingApplied = existing[key];

      if (existingApplied?.processing) return existing;

      const updated = {
        ...existing,
        [key]: {
          applied: !existingApplied?.applied,
          processing: false,
          error: false,
        },
      };

      console.log(
        "updating",

        { checked: !existingApplied?.applied, key, update: updated[key] }
      );

      return updated;
    });
  }, []);

  const sceneWithMods = useApplyModifications({
    scene,
    appliedModifications: appliedModification,
  });

  if (loading || !sceneWithMods) return <h1>loading...</h1>;

  if (!valid) return <h1>Invalid token id</h1>;

  return (
    <>
      <Canvas>
        <ErrorBoundary>
          {scene && (
            <>
              <Environment environment={sceneWithMods.environment} />
              <ElementsTree elements={sceneWithMods.elements} />
            </>
          )}
          <Controls />
        </ErrorBoundary>
      </Canvas>
      <ModificationControls
        toggleApplied={toggleApplied}
        applied={appliedModification}
        modifications={availableModifications}
        canAlwaysModify={canAlwaysModify}
        tokenId={tokenId}
      />
    </>
  );
};

export default SceneRenderer;
