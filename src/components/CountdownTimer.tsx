/* eslint-disable no-bitwise */
// @ts-nocheck
import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styled from "styled-components";

const Heading = styled.h3`
  color: ${(props) => props.theme.palette.secondary.main};
`;

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

const renderTime = (dimension: any, time: any) => {
  return (
    <TimeWrapper>
      <TimeStyles>{time}</TimeStyles>
      <TimeDimensionStyles>{dimension}</TimeDimensionStyles>
    </TimeWrapper>
  );
};

const getTimeSeconds = (time: any) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time: any) =>
  ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time: any) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time: any) => (time / daySeconds) | 0;

const CountdownTimer = ({
  unixEndTimeInSeconds,
  info = "Rewards starts in",
}: {
  unixEndTimeInSeconds: number;
  info: string;
}) => {
  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = unixEndTimeInSeconds; // use UNIX timestamp in seconds
  const remainingTime = endTime - stratTime;

  if (endTime && remainingTime > 0) {
    const days = Math.ceil(remainingTime / daySeconds);
    const daysDuration = days * daySeconds;

    return (
      <Container>
        <div>
          <Heading marginBottom="5px" color="#99a3ba">
            {info}
          </Heading>
        </div>
        <CountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#EBCC5D", 0.5],
                ["#EBCC5D", 0.5],
              ]}
              duration={daysDuration}
              initialRemainingTime={remainingTime}
              strokeWidth={2}
              size={75}
              isLinearGradient
            >
              {({ elapsedTime }) =>
                renderTime("days", getTimeDays(daysDuration - elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#EBCC5D", 0.5],
                ["#EBCC5D", 0.5],
              ]}
              duration={daySeconds}
              initialRemainingTime={remainingTime % daySeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > hourSeconds,
                0,
              ]}
              strokeWidth={2}
              size={75}
              isLinearGradient
            >
              {({ elapsedTime }) =>
                renderTime("hours", getTimeHours(daySeconds - elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#EBCC5D", 0.5],
                ["#EBCC5D", 0.5],
              ]}
              duration={hourSeconds}
              initialRemainingTime={remainingTime % hourSeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > minuteSeconds,
                0,
              ]}
              strokeWidth={2}
              isLinearGradient
              size={75}
            >
              {({ elapsedTime }) =>
                renderTime("mins", getTimeMinutes(hourSeconds - elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#EBCC5D", 0.5],
                ["#EBCC5D", 0.5],
              ]}
              duration={minuteSeconds}
              initialRemainingTime={remainingTime % minuteSeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > 0,
                0,
              ]}
              strokeWidth={2}
              isLinearGradient
              size={75}
            >
              {({ elapsedTime }) =>
                renderTime("secs", getTimeSeconds(elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
        </CountdownContainer>
      </Container>
    );
  }
  return <></>;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const SingleCountdownContainer = styled.div`
  margin: 10px;
`;

const TimeWrapper = styled.div``;
const TimeStyles = styled.div`
  color: ${(props) => props.theme.palette.secondary.main};
  font-size: 22px;
`;
const TimeDimensionStyles = styled.div`
  color: ${(props) => props.theme.palette.secondary.main};
  font-size: 16px;
`;

export default CountdownTimer;
