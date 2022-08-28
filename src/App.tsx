import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routerHistory";
import useEagerConnect from "./hooks/useEagerConnect";
import "./App.css";
import Presale from "./views/Presale";
import { BLACK_TIE_DIGITAL_PRESALE_ID } from "./config";

function App() {
  useEagerConnect();
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact>
          <Presale id={BLACK_TIE_DIGITAL_PRESALE_ID} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
