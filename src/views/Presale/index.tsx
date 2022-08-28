import React from "react";
import IVCOPage from "./IVCOPage";
import { Container } from "@mui/material";
import { BLACK_TIE_DIGITAL_PRESALE_ID } from "../../config";
import styled from "styled-components";

const BlackContainer = styled.div`
  background-color: #000;
`;

const Presale: React.FC = () => {
  return (
    <BlackContainer>
      <Container>
        <IVCOPage id={BLACK_TIE_DIGITAL_PRESALE_ID} />
      </Container>
    </BlackContainer>
  );
};

export default Presale;
