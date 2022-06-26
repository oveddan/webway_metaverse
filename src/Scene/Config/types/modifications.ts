import { Element } from "./elements";

export enum ModificationType {
  UpdateElement = "updateElement",
  AddElement = "addElement",
  RemoveElement = "removeElement",
  ChangeEnvironment = "changeEnvironment",
}

export type BaseModification = {
  modificationType: ModificationType;
  description: string;
};

export type UpdateElementModification = BaseModification & {
  modificationType: ModificationType.UpdateElement;
  path: string[];
  updates: {
    path: string[];
    newValue: string | number;
  }[];
};

export type AddElementModification = BaseModification & {
  modificationType: ModificationType.AddElement;
  parentPath: string[];
  newElement: Element;
};

export type RemoveElementModification = BaseModification & {
  modificationType: ModificationType.RemoveElement;
  path: string[];
};

export type UpdateEnvironmentModification = BaseModification & {
  modificationType: ModificationType.ChangeEnvironment;
  environmentFileUrl: string;
};

export type Modification =
  | UpdateElementModification
  | AddElementModification
  | RemoveElementModification
  | UpdateEnvironmentModification;

export type AvailableModifications = {
  [key: string]: Modification;
};

export type AppliedModification = {
  applied: boolean;
  processing: boolean;
  error: boolean;
};

export type AppliedModifications = {
  [key: string]: AppliedModification;
};

export type ModificationsWithStatus = {
  [key: string]: {
    modification: Modification;
    applied?: AppliedModification;
  };
};
