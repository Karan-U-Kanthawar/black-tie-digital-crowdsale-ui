import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routerHistory";
import useEagerConnect from "./hooks/useEagerConnect";
import Presale from "./views/Presale";

function App() {
  useEagerConnect();
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact>
          <Presale />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
