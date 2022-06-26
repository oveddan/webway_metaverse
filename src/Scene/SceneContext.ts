import { createContext } from "react";
import { AudioListener } from "three";

export type SceneContextType = {
  hasClicked: boolean;
  listener?: AudioListener;
};

export const SceneContext = createContext<SceneContextType | null>(null);
