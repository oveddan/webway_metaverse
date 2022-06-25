import { Link } from "react-router-dom";
import { useTokens } from "./lib/queries";

const ScenesList = () => {
  const { loading, tokens: scenes } = useTokens();

  if (loading) return null;

  return (
    <ul>
      {scenes.map((scene) => (
        <li key={scene.id}>
          <Link to={`/${scene.id}`} className="underline">
            Scene at Token {scene.id}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ScenesList;
