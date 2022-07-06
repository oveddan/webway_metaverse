import TokenScene from "./Scene/TokenScene";
import { Route, Switch } from "react-router-dom";
import ScenesList from "./Scene/ScenesList";
import TestScene from "./Scene/TestScene";
import { WagmiConfig } from "wagmi";
import client from "./web3/client";
import Profile from "./web3/Profile";

const App = () => {
  return (
    <WagmiConfig client={client}>
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
    </WagmiConfig>
  );
};

export default App;
