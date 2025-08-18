import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    mode: "dark",

    text: {
      primary: "#e2e6f8",
    },
    background: {
      default: "#040510",
    },
    primary: {
      main: "#8994e1",
    },
    secondary: {
      main: "#5b2287",
    },
    info: {
      main: "#b15dd5",
    },
  },
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    h2: {
      fontWeight: "bold",
    },
  },
});

export default Theme;
