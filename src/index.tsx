import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Providers from "./Providers";
import ResetCSS from "./styles/ResetCSS";
import { ThemeProvider } from "styled-components";
import theme from "./styles/theme";

declare const window: any;
if ("ethereum" in window) {
  (window && (window.ethereum as any)).autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ThemeProvider theme={theme}>
        <ResetCSS />
        <App />
      </ThemeProvider>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root1") as HTMLElement
);

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <ThemeProvider theme={theme}>
        <ResetCSS />
        <App />
      </ThemeProvider>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root2") as HTMLElement
);
