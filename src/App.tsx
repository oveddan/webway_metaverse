import Scene from "./Scene";
import { Route, Switch } from "react-router-dom";
import ScenesList from "./Scene/ScenesList";

const App = () => {
  return (
    <div className="w-screen h-screen">
      <Switch>
        <Route path="/:tokenId">
          <Scene />
        </Route>
        <Route path="/">
          <ScenesList />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
