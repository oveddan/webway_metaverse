import { ElementNodes } from "./elements";
import { Modification } from "./modifications";
import { Nullable } from "./shared";

export enum EnvironmentFileType {
  Hdr = "hdr",
  Image = "image",
}

export type EnvironmentConfig = {
  fileUrl?: string;
};

export type SceneConfiguration = {
  elements?: Nullable<ElementNodes>;
  environment?: Nullable<EnvironmentConfig>;
  availableMods: {
    [key: string]: Modification;
  };
};
