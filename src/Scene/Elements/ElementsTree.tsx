import { useThree } from "@react-three/fiber";
import { useContext, useEffect } from "react";
import { SceneConfiguration } from "../Config/types/scene";
import { SceneContext } from "../SceneContext";
import Element from "./Element";

const ElementsTree = ({ elements }: Pick<SceneConfiguration, "elements">) => {
  const { camera } = useThree();

  const listener = useContext(SceneContext)?.listener;

  useEffect(() => {
    if (camera && listener) {
      // @ts-ignore
      camera.add(listener);
    }
  }, [camera, listener]);

  if (!elements) return null;
  return (
    <>
      {Object.entries(elements).map(([key, element]) => (
        <Element config={element} key={key} />
      ))}
    </>
  );
};

export default ElementsTree;
