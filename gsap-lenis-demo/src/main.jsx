import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // Remove StrictMode in dev if you suspect duplicate mounts causing noise.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
