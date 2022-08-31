import React from "react";
import { ICrowdsale, ICrowdsaleContractData } from "../config";
import { ethers } from "ethers";
import { LinearProgress, Stack } from "@mui/material";
import {
  Card,
  CardBody,
  CardSubHeading,
  CardHeading,
} from "../styles/CardStyles";
import CountdownTimer from "./CountdownTimer";

const TimerCard = ({
  isEnded,
  isVestingEnded,
  isVestingYetToStart,
  isVestingStarted,
  isOngoing,
  crowdsaleData,
  crowdsaleContractData,
}: {
  isEnded: boolean;
  isVestingEnded: boolean;
  isVestingYetToStart: boolean;
  isVestingStarted: boolean;
  isOngoing: boolean;
  crowdsaleData: ICrowdsale;
  crowdsaleContractData: ICrowdsaleContractData;
}) => {
  return (
    <Card>
      {isEnded ? (
        <CardBody>
          {isVestingEnded && isEnded && crowdsaleData && (
            <Stack justifyContent="center" alignItems="center">
              <CardSubHeading style={{ textAlign: "center" }}>
                Presale is Finished
              </CardSubHeading>
              <CardHeading style={{ textAlign: "center", marginTop: "20px" }}>
                {new Date(
                  parseFloat(crowdsaleData.crowdsaleEnd) * 1000
                ).toLocaleDateString()}
              </CardHeading>
            </Stack>
          )}
          {isVestingYetToStart && (
            <CountdownTimer
              unixEndTimeInSeconds={
                parseFloat(crowdsaleData.vestingStart) +
                parseFloat(crowdsaleData.cliffDuration)
              }
              info="Presale has ended and Vesting will start in"
            />
          )}
          {isVestingStarted && (
            <CountdownTimer
              unixEndTimeInSeconds={parseFloat(crowdsaleData.vestingEnd)}
              info="Vesting has been started and will end in"
            />
          )}
        </CardBody>
      ) : (
        <Stack gap={1}>
          {!isEnded && crowdsaleData && (
            <CountdownTimer
              unixEndTimeInSeconds={
                isOngoing
                  ? parseFloat(crowdsaleData.crowdsaleEnd)
                  : parseFloat(crowdsaleData.crowdsaleStart)
              }
              info={
                isOngoing
                  ? "Presale has started and will end in"
                  : "Presale will start in"
              }
            />
          )}
          <Stack gap={1}>
            <CardSubHeading>
              Progress: {crowdsaleContractData.percentage.toFixed(2)} %
            </CardSubHeading>
            <LinearProgress
              variant="determinate"
              value={crowdsaleContractData.percentage}
              color={"secondary"}
            />
            <CardSubHeading>
              {`${
                crowdsaleContractData.progressAmount
              } / ${ethers.utils.formatEther(crowdsaleData.hardcap)}`}
            </CardSubHeading>
          </Stack>
        </Stack>
      )}
    </Card>
  );
};

export default TimerCard;
