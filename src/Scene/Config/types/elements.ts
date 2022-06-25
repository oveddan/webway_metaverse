import { Nullable } from "./shared";

export enum ElementType {
  Model = "model",
  Image = "image",
}

export type IVector3 = {
  x: number;
  y: number;
  z: number;
};

export type Transform = {
  position: IVector3;
  rotation: IVector3;
  scale: IVector3;
};

export type BaseElement = {
  transform?: Nullable<Transform>;
  elementType: ElementType;
  children?: Nullable<Element[]>;
};

export type ModelElement = BaseElement & {
  elementType: ElementType.Model;
  modelConfig: ModelConfig;
};

export type ImageElement = BaseElement & {
  elementType: ElementType.Image;
  imageConfig: ImageConfig;
};

export type Element = ModelElement | ImageElement;

export type ModelConfig = {
  fileUrl?: Nullable<string>;
};

export type ImageConfig = {
  fileUrl: string;
};
