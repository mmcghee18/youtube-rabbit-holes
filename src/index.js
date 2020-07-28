import React from "react";
import ReactDOM from "react-dom";
// import App from "./App";
import { App } from "./data-vis/forceLayout.js";
import { GlobalStyle } from "./styles/styles.js";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <GlobalStyle />
  </React.StrictMode>,
  document.getElementById("root")
);
