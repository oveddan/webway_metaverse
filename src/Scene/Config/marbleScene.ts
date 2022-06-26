import { toIpfsUrl } from "../lib/ipfs";
import { ElementType } from "./types/elements";
import {
  AvailableModifications,
  ModificationType,
} from "./types/modifications";
import { SceneConfiguration } from "./types/scene";

const marbleScene: SceneConfiguration = {
  environment: {
    fileUrl:
      "https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/kloppenheim_02_1k.pic?alt=media&token=42249658-2916-496b-84ab-f66481b46668",
  },
  elements: {
    model: {
      elementType: ElementType.Model,
      modelConfig: {
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/MarbleTheater-Metallic.glb?alt=media&token=137e6259-00c5-46e3-8a0b-fbe1398b98c1",
      },
    },
    water: {
      elementType: ElementType.Water,
      waterConfig: {
        color: "white",
        flowSpeed: 0.1,
        height: 50,
        width: 50,
        scale: 10,
      },
    },
  image: {
    elementType: ElementType.Image,
    imageConfig: {
      fileUrl: 'https://firebasestorage.googleapis.com/v0/b/mintxr-experiment.appspot.com/o/oiltimercolored_hu86ad23eb56ff66ff007b5a426357b158_7375980_700x0_resize_box_2.png?alt=media&token=d311f24a-6257-460c-ab32-413859fb75d4'
    },
    transform: {
      position: {
        y: 5,
        z: -33,
        x: 0
      },
      scale: {
        x: 5,
        y: 5,
        z: 5
      }
    }
  }
  },
};
export const marbleSceneMods: AvailableModifications = {
  changeWaterColor: {
    modificationType: ModificationType.UpdateElement,
    description: "Make Water Green",
    path: ["water"],
    updates: [
      {
        path: ["waterConfig", "color"],
        newValue: "green",
      },
    ],
  },
  makeSkyOnFire: {
    modificationType: ModificationType.ChangeEnvironment,
    description: "Make the Sky On Fire",
    environmentFileUrl: toIpfsUrl(
      "QmeK5K7uL6B1NAH6cYKK7eE5XfnUv7r7jGajRwRQHVZz5W"
    ),
  },
};

export default marbleScene;
