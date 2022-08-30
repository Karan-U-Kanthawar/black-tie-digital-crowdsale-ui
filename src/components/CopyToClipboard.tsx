import React, { useState } from "react";
import styled from "styled-components";
import { ContentCopy } from "@mui/icons-material";

interface Props {
  toCopy: string;
}

const Text = styled.p``;

const StyleButton = styled(Text).attrs({ role: "button" })`
  margin-top: 5px;
  display: flex;
  align-items: center;
  position: relative;
  flex-direction: column;
  color: ${(props) => props.theme.palette.secondary.main};
`;

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) =>
    isTooltipDisplayed ? "block" : "none"};
  margin-top: 10px;
  position: absolute;
  left: -20px;
  top: 20px;
  padding: 3px 10px;
  text-align: center;
  background-color: ${(props) => props.theme.palette.background.default};
  color: ${(props) => props.theme.palette.secondary.main};
  border-radius: 16px;
  opacity: 0.7;
`;

const CopyToClipboard: React.FC<Props> = ({ toCopy, children, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  return (
    <StyleButton
      onClick={() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(toCopy);
          setIsTooltipDisplayed(true);
          setTimeout(() => {
            setIsTooltipDisplayed(false);
          }, 1000);
        }
      }}
      {...props}
    >
      {children}
      <ContentCopy width="15px" style={{ marginLeft: "5px" }} />
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
    </StyleButton>
  );
};

export default CopyToClipboard;
