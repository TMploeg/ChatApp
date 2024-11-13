import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppContainer from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  </StrictMode>
);
