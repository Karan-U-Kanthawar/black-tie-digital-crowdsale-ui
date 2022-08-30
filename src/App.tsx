import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routerHistory";
import Presale from "./views/Presale";
import useWeb3Config from "./components/Menu/useWeb3Config";
import Menu from "./components/Menu";

function App() {
  useWeb3Config();
  return (
    <Router history={history}>
      <Menu />
      <Switch>
        <Route path="/" exact>
          <Presale />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
