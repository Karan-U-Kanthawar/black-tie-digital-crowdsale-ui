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
import web3 from "../utils/web3";

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
          <CardText>{`${web3.utils.fromWei(crowdsaleData.hardcap, "ether")} ${
            crowdsaleData.token.symbol
          }`}</CardText>
        </CardRow>
      </CardBody>
    </Card>
  );
};

export default PoolInfoCard;
