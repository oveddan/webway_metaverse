import { createContext } from "react";

export type SceneContextType = {
  hasClicked: boolean;
};

export const SceneContext = createContext<SceneContextType | null>(null);
