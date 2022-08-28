import React from "react";
import { BLACK_TIE_DIGITAL_SOCIALS } from "../config";
import { Box, Button, IconButton } from "@mui/material";
import { Telegram, Twitter } from "@mui/icons-material";

const socialData = BLACK_TIE_DIGITAL_SOCIALS;

const SocialsContainer: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px 0px",
      }}
    >
      <IconButton href={socialData.twitter.link} target={"_blank"}>
        <Twitter color="primary" />
      </IconButton>
      <IconButton href={socialData.telegram.link} target={"_blank"}>
        <Telegram href={socialData.telegram.link} color="primary" />
      </IconButton>
      <Button href={socialData.whitepaper.link} target="_blank">
        Whitepaper
      </Button>
    </Box>
  );
};

export default SocialsContainer;
