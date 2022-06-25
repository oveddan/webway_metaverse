import { useEffect, useState } from "react";
import { Element, ElementType, Transform } from "../Config/types/elements";
import { Vector3 } from "three";
import { Nullable } from "../Config/types/shared";
import ModelElement from "./ModelElement";
import ElementsTree from "./ElementsTree";

const useTransform = (transformConfig?: Nullable<Transform>) => {
  const [transform, setTransform] = useState<{
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
  }>({});

  useEffect(() => {
    if (!transform) {
      setTransform({});
      return;
    }
    const { position, rotation, scale } = transform;

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
  }, [transformConfig]);

  return transform;
};

const ElementComponent = ({ config }: { config: Element }) => {
  const transform = useTransform(config.transform);

  return (
    <group
      position={transform.position}
      scale={transform.scale}
      // @ts-ignore
      rotation={transform.rotation}
    >
      {config.elementType === ElementType.Model && (
        <ModelElement config={config.modelConfig} />
      )}

      <ElementsTree elements={config.children} />
    </group>
  );
};

export default ElementComponent;
