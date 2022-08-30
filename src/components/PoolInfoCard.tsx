import React from "react";
import {
  Card,
  CardHeading,
  Hr,
  CardBody,
  CardRow,
  CardSubHeading,
  CardText,
} from "../styles/CardStyles";
import { ICrowdsale } from "../config";
import { ethers } from "ethers";

const PoolInfoCard = ({ crowdsaleData }: { crowdsaleData: ICrowdsale }) => {
  return (
    <Card>
      <CardHeading>Pool Info</CardHeading>
      <Hr />
      <CardBody>
        <CardRow>
          <CardSubHeading>Starts On</CardSubHeading>
          <CardText>
            {new Date(
              parseFloat(crowdsaleData.crowdsaleStart) * 1000
            ).toLocaleDateString()}
          </CardText>
        </CardRow>
        <CardRow>
          <CardSubHeading>Ends On</CardSubHeading>
          <CardText>
            {new Date(
              parseFloat(crowdsaleData.crowdsaleEnd) * 1000
            ).toLocaleDateString()}
          </CardText>
        </CardRow>
        <CardRow>
          <CardSubHeading>HardCap</CardSubHeading>
          <CardText>{`${ethers.utils.formatEther(crowdsaleData.hardcap)} ${
            crowdsaleData.token.symbol
          }`}</CardText>
        </CardRow>
      </CardBody>
    </Card>
  );
};

export default PoolInfoCard;
