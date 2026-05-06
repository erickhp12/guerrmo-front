import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import MockupRoutes from "./mockupRoutes";
import config from "./config.js";
import { initSession } from "./utils.js";
import "./tailwind.css";

const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSession(config.API_URL).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <MockupRoutes />
    </HashRouter>
  );
};

ReactDOM.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
  document.getElementById("root")
);
