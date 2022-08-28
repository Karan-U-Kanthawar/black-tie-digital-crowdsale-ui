import React from "react";
import IVCOPage from "./IVCOPage";
import { Container } from "@mui/material";
import { BLACK_TIE_DIGITAL_PRESALE_ID } from "../../config";

const Presale: React.FC = () => {
  return (
    <Container>
      <IVCOPage id={BLACK_TIE_DIGITAL_PRESALE_ID} />
    </Container>
  );
};

export default Presale;
