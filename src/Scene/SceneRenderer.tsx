import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "../shared/ErrorBoundary";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";

import { SceneConfiguration } from "./Config/types/scene";

const SceneRenderer = ({
  loading,
  valid,
  scene,
}: {
  loading: boolean;
  valid?: boolean;
  scene?: SceneConfiguration;
}) => {
  if (loading) return <h1>loading...</h1>;

  if (!valid) return <h1>Invalid token id</h1>;

  return (
    <Canvas>
      <ErrorBoundary>
        {scene && (
          <>
            <Environment environment={scene.environment} />
            <ElementsTree elements={scene.elements} />
          </>
        )}
        <Controls />
      </ErrorBoundary>
    </Canvas>
  );
};

export default SceneRenderer;
