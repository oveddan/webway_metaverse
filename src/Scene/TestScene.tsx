import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import marbleScene, { marbleSceneMods } from "./Config/marbleScene";
import {
  AppliedModifications,
  ModificationsWithStatus,
} from "./Config/types/modifications";
import SceneRenderer from "./SceneRenderer";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const testScenes = {
  marble: marbleScene,
};

const availableModifications = marbleSceneMods;

const TestScene = () => {
  const query = useQuery();

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

  const [modificationsWithStatus, setModificationsWithStatus] =
    useState<ModificationsWithStatus>({});

  useEffect(() => {
    const combined = Object.entries(availableModifications).reduce(
      (acc: ModificationsWithStatus, [key, mod]) => {
        acc[key] = {
          applied: appliedModification[key],
          modification: mod,
        };
        return acc;
      },
      {}
    );

    setModificationsWithStatus(combined);
  }, [appliedModification, availableModifications]);

  const sceneParam = query.get("scene");

  if (!sceneParam) return <h1>Missing scene in query params</h1>;

  // @ts-ignore
  const scene = testScenes[sceneParam];

  if (!scene) return <h1>Invalid scene id</h1>;

  return (
    <SceneRenderer
      loading={false}
      valid
      scene={scene}
      modifications={modificationsWithStatus}
      toggleApplied={toggleApplied}
      canAlwaysModify
    />
  );
};

export default TestScene;
