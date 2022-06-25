import { SceneConfiguration } from "../Config/types/scene";
import Element from "./Element";

const ElementsTree = ({ elements }: Pick<SceneConfiguration, "elements">) => {
  if (!elements) return null;
  return (
    <>
      {elements.map((element, i) => (
        <Element config={element} key={i} />
      ))}
    </>
  );
};

export default ElementsTree;
