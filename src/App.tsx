import TokenScene from "./Scene/TokenScene";
import { Route, Switch } from "react-router-dom";
import ScenesList from "./Scene/ScenesList";
import TestScene from "./Scene/TestScene";

const App = () => {
  return (
    <div className="w-screen h-screen">
      <Switch>
        <Route path="/test">
          <TestScene />
        </Route>

        <Route path="/:tokenId">
          <TokenScene />
        </Route>
        <Route path="/">
          <ScenesList />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
