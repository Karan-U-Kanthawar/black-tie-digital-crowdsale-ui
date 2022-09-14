import KronaOne from "./KronaOne.ttf";
import Anton from "./Anton.ttf";
import DancingScript from "./DancingScript.ttf";
import { createGlobalStyle } from "styled-components";

const ResetCSS = createGlobalStyle`
  @font-face {
    font-family: 'KronaOne';
    src: url(${KronaOne}) format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: auto;
  }

  @font-face {
    font-family: 'Anton';
    src: url(${Anton}) format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: auto;
  }

  @font-face {
    font-family: 'DancingScript';
    src: url(${DancingScript}) format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: auto;
  }

  #root1, #root2 {
    font-family: "Montserrat", sans-serif;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.palette.primary.main};
    border-radius: 1px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #000;
    border-radius: 1px;
  }
`;

export default ResetCSS;
