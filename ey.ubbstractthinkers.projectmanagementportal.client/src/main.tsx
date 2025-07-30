import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import ThemeCssVars from "./utils/ThemeCssVars.tsx";
import Theme from "./utils/Theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ThemeCssVars />
      <App />
    </ThemeProvider>
  </StrictMode>
);
