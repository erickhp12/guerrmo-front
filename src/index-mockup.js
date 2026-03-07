import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import MockupRoutes from "./mockupRoutes";
import "./tailwind.css";

ReactDOM.render(
  <HashRouter>
    <MockupRoutes />
  </HashRouter>,
  document.getElementById("root")
);
