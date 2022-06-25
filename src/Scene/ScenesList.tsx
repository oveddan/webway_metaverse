import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const useScenes = () => {
  const [scenes, setScenes] = useState<
    {
      tokenId: string;
      name: string;
    }[]
  >();

  useEffect(() => {
    setScenes([
      {
        name: "sceneA",
        tokenId: "asdfasfda",
      },
      {
        name: "sceneB",
        tokenId: "asdfasdfasdfasdfasdfas",
      },
    ]);
  }, []);

  return scenes;
};

const ScenesList = () => {
  const scenes = useScenes();

  if (!scenes) return null;

  return (
    <ul>
      {scenes.map((scene) => (
        <li key={scene.tokenId}>
          <Link to={`/${scene.tokenId}`} className="underline">
            {scene.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ScenesList;
