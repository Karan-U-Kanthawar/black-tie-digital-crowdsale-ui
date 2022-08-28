import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Providers from "./Providers";
import ResetCSS from "./styles/ResetCSS";

declare const window: any;
if ("ethereum" in window) {
  (window && (window.ethereum as any)).autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ResetCSS />
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
