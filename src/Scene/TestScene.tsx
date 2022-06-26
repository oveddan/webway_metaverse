import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import marbleScene, { marbleSceneMods } from "./Config/marbleScene";
import SceneRenderer from "./SceneRenderer";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const testScenes = {
  marble: marbleScene,
};

const TestScene = () => {
  const query = useQuery();

  const sceneParam = query.get("scene");

  if (!sceneParam) return <h1>Missing scene in query params</h1>;

  // @ts-ignore
  const scene = testScenes[sceneParam];

  if (!scene) return <h1>Invalid scene id</h1>;

  return (
    <SceneRenderer
      loading={false}
      valid
      scene={scene}
      availableModifications={marbleSceneMods}
      canAlwaysModify
    />
  );
};

export default TestScene;
