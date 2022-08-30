import CopyToClipboard from "./CopyToClipboard";
import convertToInternationalCurrencySystem from "../utils/displayCurrency";
import SocialsContainer from "./SocialsContainer";
import React from "react";
import { ICrowdsale } from "../config";
import { Stack } from "@mui/material";
import styled from "styled-components";

const ImgContainer = styled.div``;
const HeadingContainer = styled.div``;
const Title = styled.h1`
  text-align: center;
  font-weight: 600;
  font-size: 30px;
  margin-left: 15px;
  color: ${(props) => props.theme.palette.text.secondary};
`;
const SubTitle = styled.h3`
  margin-left: 10px;
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.disabled};
  margin-top: 12px;
`;

const TextKey = styled.h4`
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.disabled};
`;
const TextValue = styled.h4`
  font-weight: 600;
  font-size: 18px;
  margin-left: 5px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const HeroCard = ({
  crowdsaleData,
  totalSupply,
}: {
  crowdsaleData: ICrowdsale;
  totalSupply: string;
}) => {
  return (
    <Stack marginBottom={"20px"}>
      <Stack direction={"row"} marginBottom={"20px"}>
        <ImgContainer>
          <img
            src={crowdsaleData.token.url}
            alt={crowdsaleData.token.symbol}
            width="70px"
            height="70px"
            style={{ marginBottom: "10px", marginRight: "20px" }}
          />
        </ImgContainer>
        <HeadingContainer>
          <Title>
            {crowdsaleData.token.name}
            <SubTitle> ( {crowdsaleData.token.symbol} ) </SubTitle>
          </Title>
        </HeadingContainer>
      </Stack>
      <Stack
        direction={"row"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
      >
        <Stack
          display={"flex"}
          alignItems={"center"}
          fontSize={"18px"}
          fontWeight={600}
          direction={"row"}
        >
          <TextKey>
            {`${crowdsaleData.token.address.slice(
              0,
              4
            )}...${crowdsaleData.token.address.slice(
              crowdsaleData.token.address.length - 4
            )}`}
          </TextKey>
          <CopyToClipboard toCopy={crowdsaleData.token.address} />
        </Stack>
        <Stack direction={"row"}>
          <TextKey>Total Supply : </TextKey>
          <TextValue>
            {convertToInternationalCurrencySystem(totalSupply)}
          </TextValue>
        </Stack>
      </Stack>
      <SocialsContainer />
    </Stack>
  );
};

export default HeroCard;
