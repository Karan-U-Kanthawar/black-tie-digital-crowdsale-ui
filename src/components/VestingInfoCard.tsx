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
import millisecondsToReadable from "../utils/millisecondsToReadable";
import unixTimeConverter from "../utils/unixTimeConverter";
import { BLACK_TIE_DIGITAL_SOCIALS, ICrowdsale } from "../config";

const socialData = BLACK_TIE_DIGITAL_SOCIALS;

const VestingInfoCard = ({ crowdsaleData }: { crowdsaleData: ICrowdsale }) => {
  return (
    <Card>
      <CardHeading>Vesting Info</CardHeading>
      <Hr />
      <CardBody>
        <CardRow>
          <CardSubHeading>Vesting Start</CardSubHeading>
          <CardText>
            {parseFloat(crowdsaleData.vestingStart) === 0
              ? "End Manually "
              : unixTimeConverter(parseFloat(crowdsaleData.vestingStart))}
          </CardText>
        </CardRow>
        <CardRow>
          <CardSubHeading>Vesting End</CardSubHeading>
          <CardText>
            {parseFloat(crowdsaleData.vestingEnd) === 0
              ? "End Manually "
              : unixTimeConverter(parseFloat(crowdsaleData.vestingEnd))}
          </CardText>
        </CardRow>
        <CardRow>
          <CardSubHeading>Cliff duration</CardSubHeading>
          <CardText>
            {Number(crowdsaleData.cliffDuration) === 0
              ? "End Manually"
              : millisecondsToReadable(
                  (
                    parseFloat(crowdsaleData.cliffDuration.toString()) * 1000
                  ).toString()
                )}
          </CardText>
        </CardRow>
        <CardRow>
          <CardSubHeading>Vesting Period</CardSubHeading>
          <CardText>
            {Number(crowdsaleData.vestingEnd) -
              Number(crowdsaleData.vestingStart) ===
            0
              ? "End Manually"
              : millisecondsToReadable(
                  (
                    Number(crowdsaleData.vestingEnd) -
                    Number(crowdsaleData.vestingStart)
                  ).toString()
                )}
          </CardText>
        </CardRow>
      </CardBody>
      {socialData && socialData.vestingInfo && (
        <div style={{ marginTop: "20px" }}>
          <CardSubHeading>{socialData.vestingInfo}</CardSubHeading>
        </div>
      )}
    </Card>
  );
};

export default VestingInfoCard;
