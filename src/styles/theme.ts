import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#EBCC5D",
    },
    secondary: {
      main: "#ffffff",
    },
    error: {
      main: "#eb645d",
    },
    success: {
      main: "#5deb6e",
    },
    background: {
      default: "#000000",
      paper: "rgba(0,0,0,0.36)",
    },
  },
});

export default theme;
