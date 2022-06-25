import { SceneConfiguration } from "./types/scene";

export interface Erc721Token {
  name: string;
  description?: string;
  animation_url: string;
  scene_config: SceneConfiguration;
}
