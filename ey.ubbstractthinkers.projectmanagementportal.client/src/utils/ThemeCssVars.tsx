import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";

const ThemeCssVars = () => {
  const theme = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-text", theme.palette.text.primary);
    root.style.setProperty("--color-bg", theme.palette.background.default);
    root.style.setProperty("--color-primary", theme.palette.primary.main);
    root.style.setProperty("--color-secondary", theme.palette.secondary.main);
    root.style.setProperty("--color-accent", theme.palette.info.main);
  }, [theme]);

  return null;
};

export default ThemeCssVars;
