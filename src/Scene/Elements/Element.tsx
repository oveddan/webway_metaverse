import { useEffect, useState } from "react";
import { Element, ElementType, Transform } from "../Config/types/elements";
import { Vector3 } from "three";
import { Nullable } from "../Config/types/shared";
import ModelElement from "./ModelElement";
import ElementsTree from "./ElementsTree";
import WaterElement from "./WaterElement";
import ImageElement from "./ImageElement";

const useTransform = (transform?: Nullable<Transform>) => {
  const [convertedTrasnform, setTransform] = useState<{
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
  }>({});

  useEffect(() => {
    if (!convertedTrasnform) {
      setTransform({});
      return;
    }
    const { position, rotation, scale } = convertedTrasnform;

    const positionVector = position
      ? new Vector3(position.x, position.y, position.z)
      : undefined;
    const rotationVector = rotation
      ? new Vector3(rotation.x, rotation.y, rotation.z)
      : undefined;
    const scaleVector = scale
      ? new Vector3(scale.x, scale.y, scale.z)
      : undefined;

    setTransform({
      position: positionVector,
      rotation: rotationVector,
      scale: scaleVector,
    });
  }, [convertedTrasnform, transform]);

  return convertedTrasnform;
};

const ElementComponent = ({ config }: { config: Element }) => {
  const transform = config.transform

  return (
    <group
      position-x={transform?.position?.x}
      position-y={transform?.position?.y}
      position-z={transform?.position?.z}
      scale-x={transform?.scale?.x}
      scale-y={transform?.scale?.y}
      scale-z={transform?.scale?.z}
      rotate-x={transform?.rotation?.x}
      rotate-y={transform?.rotation?.y}
      rotate-z={transform?.rotation?.z}
      // scale={transform.scale}
      // @ts-ignore
      // rotation={transform.rotation}
    >
      {config.elementType === ElementType.Model && (
        <ModelElement config={config.modelConfig} />
      )}

      {config.elementType === ElementType.Water && (
        <WaterElement config={config.waterConfig} />
      )}

      {config.elementType === ElementType.Image && (
        <ImageElement config={config.imageConfig} />
      )}

      <ElementsTree elements={config.children} />
    </group>
  );
};

export default ElementComponent;
