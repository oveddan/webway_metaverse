import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorBoundary from "../shared/ErrorBoundary";
import Controls from "./Controls";
import ElementsTree from "./Elements/ElementsTree";
import Environment from "./Elements/Environment";
import { useTokenScene } from "./lib/queries";

const Root = () => {
  const { tokenId } = useParams<{
    tokenId: string;
  }>();

  const { loading, scene: sceneConfig, valid } = useTokenScene(tokenId);

  if (loading) return <h1>loading...</h1>;

  if (!valid) return <h1>Invalid token id</h1>;

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
