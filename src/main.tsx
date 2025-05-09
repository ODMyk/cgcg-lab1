import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";

import App from "./App";
import {configuredStore} from "./store/configureStore";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={configuredStore.store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
