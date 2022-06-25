import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorBoundary from "../shared/ErrorBoundary";
import marbleScene from "./Config/marbleScene";
import { SceneConfiguration } from "./Config/types/scene";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";

function useSceneConfig(tokenId: string) {
  const [scene, setScene] = useState<SceneConfiguration>();

  useEffect(() => {
    setScene(marbleScene);
  }, [tokenId]);

  return scene;
}

const Root = () => {
  const { tokenId } = useParams<{
    tokenId: string;
  }>();

  const sceneConfig = useSceneConfig(tokenId);

  return (
    <Canvas>
      <ErrorBoundary>
        {sceneConfig && (
          <>
            <Environment environment={sceneConfig.environment} />
            <ElementsTree elements={sceneConfig.elements} />
          </>
        )}
        <Controls />
      </ErrorBoundary>
    </Canvas>
  );
};

export default Root;
