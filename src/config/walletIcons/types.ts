import { SVGAttributes } from "react";
import styled from "styled-components";
import { DefaultTheme } from "styled-components";

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement> {
  theme?: DefaultTheme;
  spin?: boolean;
  bgColor?: string;
  insideColor?: string;
}

const Svg = styled.svg<SvgProps>`
  flex-shrink: 0;
`;

Svg.defaultProps = {
  color: "text",
  width: "20px",
  xmlns: "http://www.w3.org/2000/svg",
  spin: false,
};

export default Svg;
