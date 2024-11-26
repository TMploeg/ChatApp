import { createRoot } from "react-dom/client";
import AppContainer from "./AppContainer.tsx";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>
);
