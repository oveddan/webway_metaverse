import { useEffect, useState } from "react";
import { SceneConfiguration } from "./types/scene";
import { Element, ElementNodes } from "./types/elements";
import { cloneDeep, update } from "lodash";
import {
  ModificationsWithStatus,
  ModificationType,
} from "./types/modifications";
import { Nullable } from "./types/shared";

const findElement = (
  elements: Nullable<ElementNodes> | undefined,
  path: string[]
) => {
  if (!elements) return;
  let toChange: Element | null = null;
  let children = elements;
  for (let pathPart of path) {
    toChange = children[pathPart];
  }

  return toChange;
};

const useApplyModifications = ({
  scene,
  modifications,
}: {
  scene?: SceneConfiguration;
  modifications: ModificationsWithStatus;
}) => {
  const [sceneWithMods, setSceneWithMods] =
    useState<Pick<SceneConfiguration, "elements" | "environment">>();

  useEffect(() => {
    if (!scene) return;

    const resultEnvironment = {
      ...scene?.environment,
    };

    const elements = cloneDeep(scene?.elements);

    Object.entries(modifications).forEach(
      ([key, { applied, modification }]) => {
        if (!applied) return;
        if (!applied.applied) return;
        if (!modification) return;

        if (modification.modificationType === ModificationType.UpdateElement) {
          const toChange = findElement(elements, modification.path);

          if (!toChange) return;

          modification.updates.forEach((updateToApply) => {
            update(toChange, updateToApply.path, () => updateToApply.newValue);
          });
        }

        if (
          modification.modificationType === ModificationType.ChangeEnvironment
        ) {
          resultEnvironment.fileUrl = modification.environmentFileUrl;
        }
      }
    );

    setSceneWithMods({
      elements,
      environment: resultEnvironment,
    });
  }, [scene, modifications]);

  return sceneWithMods;
};

export default useApplyModifications;
