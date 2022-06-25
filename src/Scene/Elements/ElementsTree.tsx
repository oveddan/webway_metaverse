import { SceneConfiguration } from "../Config/types/scene";
import Element from "./Element";

const ElementsTree = ({ elements }: Pick<SceneConfiguration, "elements">) => {
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
