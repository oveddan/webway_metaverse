import { useEffect, useState } from "react";
import { AppliedModifications } from "../../UI/ModificationControls";
import { SceneConfiguration } from "./types/scene";
import { Element, ElementNodes } from "./types/elements";
import { cloneDeep, result, update } from "lodash";
import {
  AvailableModifications,
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
  appliedModifications,
  availableMods,
}: {
  scene?: SceneConfiguration;
  availableMods?: AvailableModifications;
  appliedModifications: AppliedModifications;
}) => {
  const [sceneWithMods, setSceneWithMods] =
    useState<Pick<SceneConfiguration, "elements" | "environment">>();

  useEffect(() => {
    if (!scene) return;

    const resultEnvironment = {
      ...scene?.environment,
    };

    const elements = cloneDeep(scene?.elements);

    Object.entries(appliedModifications).forEach(
      ([key, appliedModification]) => {
        if (!availableMods) return;
        if (!appliedModification.applied) return;
        const modification = availableMods[key];
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
  }, [scene, appliedModifications]);

  return sceneWithMods;
};

export default useApplyModifications;
