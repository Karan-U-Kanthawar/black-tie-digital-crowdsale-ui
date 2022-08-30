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
      main: "#57ca81",
    },
    background: {
      default: "#000000",
      paper: "#0D0D0D",
    },
    text: {
      primary: "#EBCC5D",
      secondary: "#ffffff",
      disabled: "#9E9E9E",
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
