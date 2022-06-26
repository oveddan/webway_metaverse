import { Nullable } from "./shared";

export enum ElementType {
  Model = "model",
  Image = "image",
  Video = "video",
  Water = "water",
}

export type IVector3 = {
  x?: number;
  y?: number;
  z?: number;
};

export type Transform = {
  position?: IVector3;
  rotation?: IVector3;
  scale?: IVector3;
};

export type BaseElement = {
  transform?: Nullable<Transform>;
  elementType: ElementType;
  children?: Nullable<ElementNodes>;
};

export type ModelElement = BaseElement & {
  elementType: ElementType.Model;
  modelConfig: ModelConfig;
};

export type ImageElement = BaseElement & {
  elementType: ElementType.Image;
  imageConfig: ImageConfig;
};

export type VideoElement = BaseElement & {
  elementType: ElementType.Video;
  videoConfig: VideoConfig;
};

export type WaterElement = BaseElement & {
  elementType: ElementType.Water;
  waterConfig: WaterConfig;
};

export type Element = ModelElement | ImageElement | WaterElement | VideoElement;

export type ElementNodes = {
  [id: string]: Element;
};

export type ModelConfig = {
  fileUrl?: Nullable<string>;
};

export type ImageConfig = {
  fileUrl: string;
};

export type VideoConfig = {
  file?: {
    originalUrl?: string;
    streamUrl?: string;
  };
  volume?: number;
};

export type WaterConfig = {
  width: number;
  height: number;
  flowSpeed: number;
  color: string;
  scale: number;
};
