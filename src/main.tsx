import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../default_shadcn_theme.css";
import "../styles/fonts.css";
import "../styles/theme.css";
import "../styles/tailwind.css";
import "../styles/index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
