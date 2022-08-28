import React, { useEffect, useState } from "react";
import { Card, Input, Button, Text } from "cryption-uikit-v2";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  createStyles,
  withStyles,
  Theme,
  makeStyles,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from "@material-ui/icons/Twitter";
import TelegramIcon from "@material-ui/icons/Telegram";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Container } from "@mui/material";
import Web3 from "web3";
import { ethers, Contract } from "ethers";
import tokenAbi from "../../config/constants/abi/token.json";
import CopyToClipboard from "../../components/CopyToClipboard";
import { getERC20Contract } from "../../utils/contractHelpers";
import { useCrowdsaleContract } from "../../hooks/useContract";
import CountdownTimer from "../../components/CountdownTimer";
import {
  allowedInputTokens,
  BLACK_TIE_DIGITAL_SOCIALS,
  crowdsale,
  setMetamaskGasPrice,
} from "../../config";
import useActiveWeb3React from "../../hooks";

const CustomCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.cardBg};
  box-shadow: 1px 1px 2px 1px rgb(0 0 0 / 25%);
  border-radius: 24px;
  padding: 20px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.p`
  font-weight: 600;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  color: ${({ theme }) => theme.colors.text};
`;
const Subtitle = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: #a7a7a7;
  margin-top: 12px;
`;
const Infotitle = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;
const InfotitleLink = styled.a`
  font-weight: 600;
  font-size: 14px;
  color: #2082e9;
  background: white;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;
const InfotitleLinkButton = styled.a`
  font-weight: 600;
  font-size: 14px;
  color: #2082e9;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 14px;
  padding: 10px 12px;
`;
const InfotitleRacing = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;
const TitleText = styled.p`
  font-size: 25px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  font-weight: 600;
`;
const Infosubtitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: #a7a7a7;
`;
const Hr = styled.div`
  background: linear-gradient(90.56deg, #2082e9 49.52%, #9900ff 71.78%);
  border-radius: 1px;
  transform: matrix(1, 0, 0, -1, 0, 0);
  width: 100%;
  height: 2px;
  margin: 10px 0;
`;
const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const EndContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 2px solid #469d69;
  box-sizing: border-box;
  border-radius: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  white-space: nowrap;
`;
const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #57ca81;
  margin-right: 6px;
`;
const ProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 23px;
  padding: 20px;
  margin-top: 20px;
`;
const ProgressLabel = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 38px;
  color: #a7a7a7;
  text-align: left;
`;
const ProgressEndLabel = styled.p`
  font-weight: 500;
  font-size: 13px;
  text-align: end;
  margin-top: 10px;
  color: #a7a7a7;
`;
const InputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  border: ${({ theme }) => `1px solid ${theme.colors.input}`};
  height: fit-content;
  display: flex;
  align-items: center;
  width: fit-content;
  border-radius: 14px;
  margin-top: 10px;
`;
const VestingContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const CustomInput = styled(Input)`
  box-shadow: none;
`;
// const ImageContainer = styled.div`
//   background: ${({ theme }) => theme.colors.cardBg};
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 10px;
//   border-radius: 50%;
//   width: 40px;
//   height: 40px;
// `;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      height: "30px",
      marginTop: "30px",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    icon: {
      color: "white",
    },
  })
);
const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 4,
      borderRadius: 2,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
      borderRadius: 2,
      background: "linear-gradient(90.56deg, #2082E9 49.52%, #9900FF 71.78%);",
    },
  })
)(LinearProgress);

interface IInputTokens {
  name: string;
  symbol: string;
  address: string;
  decimal: string;
  rate: string;
  userBalance: string;
}

interface IIVCOPage {
  id: string;
}

// interface ICrowdsaleData {
//   crowdsaleStart: string;
//   crowdsaleEnd: string;
//   cliffDuration: string;
//   vestingStart: string;
//   vestingEnd: string;
//   tokenRemainingForSale: string;
//   whitelistingEnabled: boolean;
//   owner: string;
//   hardcap: string;
//   token: {
//     id: string;
//     address: string;
//     name: string;
//     symbol: string;
//     url: null | string;
//     decimals: number;
//   };
// }
//
// interface IAllowedInputTokensData {
//   id: string;
//   crowdsaleAddress: {
//     id: string;
//   };
//   name: string;
//   rate: string;
//   symbol: string;
//   decimals: number;
//   address: string;
// }

function IVCOPage({ id }: IIVCOPage) {
  const { account } = useActiveWeb3React();
  const crowdsaleData = crowdsale;
  const allowedInputTokensData = allowedInputTokens;
  const [amount, setAmount] = useState("0");
  const [addresses, setAddresses] = useState<null | string>(null);
  const [pendingTx, setPendingTx] = useState(false);
  const [pendingTxForWhiteList, setPendingTxForWhiteList] = useState(false);
  const [selectedToken, toggleTokenSelection] = useState<IInputTokens>();
  const [crowdSaleContractData, setCrowdSaleContractData] = useState<{
    isWhiteListed: boolean;
    totalUserPurchased: number;
    totalRemaining: number;
    progressAmount: number;
    percentage: number;
    inputTokens: IInputTokens[];
    isOwner: boolean;
    claimable: string;
    claimed: string;
    locked: string;
    vestingTimer: number;
    totalInvest: string;
  }>({
    isWhiteListed: false,
    totalUserPurchased: 0,
    totalRemaining: 0,
    progressAmount: 0,
    percentage: 0,
    inputTokens: [],
    isOwner: false,
    claimable: "0",
    claimed: "0",
    locked: "0",
    vestingTimer: Date.now() / 1000,
    totalInvest: "0",
  });
  const [totalSupply, setTotalSupply] = React.useState("0");
  const classes = useStyles();
  const crowdSaleContract = useCrowdsaleContract(id);
  const web3 = new Web3(window.ethereum);

  const isDark = true;
  useEffect(() => {
    const getCrowdSaleData = async () => {
      if (crowdsaleData) {
        const inputTokens: IInputTokens[] = [];
        const isWhiteListedResp = await crowdSaleContract.methods
          .whitelistedAddress(account)
          .call();
        const remainingInEther = web3.utils.fromWei(
          crowdsaleData.tokenRemainingForSale,
          "ether"
        );
        const getTotalPurchasedAmount = await crowdSaleContract.methods
          .vestedAmount(account)
          .call();
        const purchasedInEther = web3.utils.fromWei(
          getTotalPurchasedAmount,
          "ether"
        );
        const vestingSchedule = await crowdSaleContract.methods
          .vestingScheduleForBeneficiary(account)
          .call();
        const totalInvest = web3.utils.fromWei(
          vestingSchedule._amount,
          "ether"
        );
        const locked = web3.utils.fromWei(
          vestingSchedule._remainingBalance,
          "ether"
        );
        const claimable = web3.utils.fromWei(
          vestingSchedule._availableForDrawDown,
          "ether"
        );
        const claimed = web3.utils.fromWei(
          vestingSchedule._totalDrawn,
          "ether"
        );
        let hardCap = 0;
        let progressAmount = 0;
        let percentage = 0;
        const vestingTimer =
          parseFloat(crowdsaleData.vestingStart) +
          parseFloat(crowdsaleData.cliffDuration);
        if (crowdsaleData && crowdsaleData.hardcap) {
          hardCap = parseFloat(
            web3.utils.fromWei(crowdsaleData.hardcap, "ether").toString()
          );
          progressAmount = hardCap - parseFloat(remainingInEther.toString());
          percentage = (progressAmount * 100) / hardCap;
        }
        const newCrowdSaleData = {
          isWhiteListed: isWhiteListedResp,
          progressAmount,
          totalInvest: totalInvest,
          locked,
          claimable,
          claimed,
          percentage,
          inputTokens,
          vestingTimer,
          isOwner:
            crowdsaleData?.owner.toLocaleLowerCase() ===
            account?.toLocaleLowerCase(),
          totalRemaining: parseFloat(remainingInEther),
          totalUserPurchased: parseFloat(purchasedInEther),
        };
        const combinedObj = {
          ...crowdSaleContractData,
          newCrowdSaleData,
        };

        setCrowdSaleContractData(combinedObj);
        if (
          crowdsaleData &&
          allowedInputTokensData &&
          allowedInputTokensData?.length > 0
        ) {
          await Promise.all(
            allowedInputTokensData.map(async (eachToken: any) => {
              const contractDetails = getERC20Contract(eachToken.address, web3);
              const userBalance = await contractDetails.methods
                .balanceOf(account)
                .call();
              const balanceInEther = new BigNumber(userBalance).div(
                10 ** parseFloat(eachToken.decimals)
              );
              inputTokens.push({
                name: eachToken.name,
                address: eachToken.address,
                symbol: eachToken.symbol,
                decimal: eachToken.decimals,
                rate: new BigNumber(eachToken.rate).div(10 ** 18).toString(),
                userBalance: balanceInEther.toString(),
              });
              inputTokens.push();
            })
          );
          newCrowdSaleData.inputTokens = inputTokens;
          toggleTokenSelection(inputTokens[0]);

          const newCombinedObj = {
            ...crowdSaleContractData,
            newCrowdSaleData,
          };

          setCrowdSaleContractData(newCombinedObj);
        }
      }
    };
    if (account) {
      getCrowdSaleData().catch((e) =>
        console.error(
          "Error while getting extra crowdsale & input token values: ",
          e
        )
      );
    }
    const getTotalSupply = async () => {
      if (crowdsaleData && crowdsaleData.token && crowdsaleData.token.address) {
        const contractDetails = await getERC20Contract(
          crowdsaleData.token.address,
          web3
        );
        const totalSupplyResp = await contractDetails.methods
          .totalSupply()
          .call();
        const supplyInEther = web3.utils.fromWei(totalSupplyResp, "ether");
        setTotalSupply(supplyInEther);
      }
    };
    getTotalSupply().catch((e) =>
      console.error("Error while getting total supply: ", e)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  const socialData = BLACK_TIE_DIGITAL_SOCIALS;
  const convertToInternationalCurrencySystem = (labelValue: any) => {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? `${(Math.abs(Number(labelValue)) / 1.0e9).toFixed(2)} B`
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(2)} M`
      : // Three Zeroes for Thousands
      Math.abs(Number(labelValue)) >= 1.0e3
      ? `${(Math.abs(Number(labelValue)) / 1.0e3).toFixed(2)} K`
      : Math.abs(Number(labelValue));
  };
  const unixTimeConverter = (unixDate: number) => {
    return new Date(unixDate * 1000).toLocaleDateString();
  };
  const timeStamp = Math.floor(+new Date() / 1000);
  let isOngoing = false;
  // let isStarted = false;
  let isEnded = false;
  let isVestingStarted = false;
  let isVestingYetToStart = false;
  let isVestingEnded = false;
  if (
    crowdsaleData &&
    crowdsaleData.crowdsaleStart &&
    crowdsaleData.crowdsaleEnd &&
    timeStamp >= parseFloat(crowdsaleData.crowdsaleStart) &&
    timeStamp < parseFloat(crowdsaleData.crowdsaleEnd)
  ) {
    isOngoing = true;
    isEnded = false;
  } else if (
    crowdsaleData &&
    crowdsaleData.crowdsaleEnd &&
    timeStamp > parseFloat(crowdsaleData.crowdsaleEnd)
  ) {
    isOngoing = false;
    isEnded = true;
    if (
      crowdsaleData &&
      crowdSaleContractData.vestingTimer &&
      crowdSaleContractData.vestingTimer > timeStamp
    ) {
      isVestingYetToStart = true;
    }
    if (
      crowdsaleData &&
      crowdSaleContractData.vestingTimer &&
      crowdSaleContractData.vestingTimer < timeStamp &&
      crowdSaleContractData.vestingTimer < parseFloat(crowdsaleData?.vestingEnd)
    ) {
      isVestingStarted = true;
      isVestingYetToStart = false;
      isVestingEnded = false;
    }
    if (
      crowdsaleData &&
      crowdSaleContractData.vestingTimer &&
      parseFloat(crowdsaleData?.vestingEnd) < timeStamp
    ) {
      isVestingStarted = false;
      isVestingEnded = true;
      isVestingYetToStart = false;
    }
  }
  const selectToken = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const changedToken = crowdSaleContractData.inputTokens.find(
      (eachToken) => eachToken.address === event.target.value
    );
    if (changedToken) toggleTokenSelection(changedToken);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  const handleMaxClick = () => {
    if (selectedToken && selectedToken.userBalance) {
      setAmount(selectedToken.userBalance);
    } else {
      setAmount("0");
    }
  };
  const purchaseToken = async () => {
    try {
      setPendingTx(true);
      if (selectedToken === undefined) return;
      const contractDetails = getERC20Contract(selectedToken.address, web3);
      const allowance = await contractDetails.methods
        .allowance(account, id)
        .call();
      const approvalAmount = ethers.utils.parseUnits(amount.toString(), 18);
      if (new BigNumber(allowance).isLessThan(approvalAmount.toString())) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new Contract(
          selectedToken.address,
          tokenAbi.abi,
          signer
        );
        const approvalTx = await tokenContract.approve(id, approvalAmount);
        await approvalTx.wait();
        let amountInVei = new BigNumber(amount).multipliedBy(
          10 ** parseFloat(selectedToken.decimal)
        );
        amountInVei = new BigNumber(
          Number(amountInVei).toLocaleString("fullwide", {
            useGrouping: false,
          })
        );
        await crowdSaleContract.methods
          .purchaseToken(selectedToken.address, amountInVei.toString())
          .send({ from: account, ...setMetamaskGasPrice });
        setPendingTx(false);
      } else {
        let amountInVei = new BigNumber(amount).multipliedBy(
          10 ** parseFloat(selectedToken.decimal)
        );
        amountInVei = new BigNumber(
          Number(amountInVei).toLocaleString("fullwide", {
            useGrouping: false,
          })
        );
        await crowdSaleContract.methods
          .purchaseToken(selectedToken.address, amountInVei.toString())
          .send({ from: account, ...setMetamaskGasPrice });
        setPendingTx(false);
      }
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const claimToken = async () => {
    try {
      setPendingTx(true);
      await crowdSaleContract.methods.drawDown().send({ from: account });
      setPendingTx(false);
    } catch (error) {
      setPendingTx(false);
      console.error(error);
    }
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddresses(event.target.value);
  };
  const whiteListAddresses = async () => {
    try {
      setPendingTxForWhiteList(true);
      if (addresses === null) return;
      const trimmedAddresses = addresses.replace(/ /g, "").split(",");
      const isWhiteListEnabled = await crowdSaleContract.methods
        .whitelistingEnabled()
        .call();
      if (!isWhiteListEnabled) {
        await crowdSaleContract.methods
          .enableWhitelisting()
          .send({ from: account, ...setMetamaskGasPrice });
      }
      await crowdSaleContract.methods
        .whitelistUsers(trimmedAddresses)
        .send({ from: account, ...setMetamaskGasPrice });
      setPendingTxForWhiteList(false);
    } catch (error) {
      console.error(error);
      setPendingTxForWhiteList(false);
    }
  };
  const millisecondsToReadable = (secondsData: string) => {
    let seconds = parseFloat(secondsData);
    if (seconds > 0) {
      seconds = Number(seconds);
      seconds = Math.abs(seconds);
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secondDiff = Math.floor(seconds % 60);

      if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""}`;
      }

      if (hours > 0) {
        return `${hours} hr${hours > 1 ? "s" : ""}`;
      }

      if (minutes > 0) {
        return `${minutes} min${minutes > 1 ? "s" : ""}`;
      }

      if (secondDiff > 0) {
        return `${secondDiff} sec${secondDiff > 1 ? "s" : ""}`;
      }
    }
    return "";
  };
  return (
    <>
      {crowdsaleData ? (
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Grid item sm={12} md={6} lg={6}>
              <Header style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={crowdsaleData.token?.url || ""}
                    alt={crowdsaleData.token.symbol}
                    width="70px"
                    height="70px"
                    style={{ marginBottom: "10px" }}
                  />
                  <div>
                    <Title style={{ textAlign: "center" }}>
                      {crowdsaleData.token.name}
                      <Subtitle
                        style={{
                          fontSize: "20px",
                          marginTop: "0px",
                          marginLeft: "10px",
                        }}
                      >
                        {" "}
                        ( {crowdsaleData.token.symbol} ){" "}
                      </Subtitle>
                    </Title>
                    <Subtitle>
                      Apply for a verified tag
                      <a href="/" target="_blank" style={{ marginLeft: "5px" }}>
                        here
                      </a>
                    </Subtitle>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Infotitle
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "18px",
                    }}
                  >
                    {`${crowdsaleData.token.address.slice(
                      0,
                      10
                    )}...${crowdsaleData.token.address.slice(
                      crowdsaleData.token.address.length - 4
                    )}`}
                    <CopyToClipboard toCopy={crowdsaleData.token.address} />
                  </Infotitle>
                  <InfoContainer style={{ marginBottom: "0px" }}>
                    <Infosubtitle style={{ fontSize: "18px" }}>
                      Total Supply:{" "}
                    </Infosubtitle>
                    <Infotitle style={{ fontSize: "18px", marginLeft: "5px" }}>
                      {" "}
                      {convertToInternationalCurrencySystem(totalSupply)}
                    </Infotitle>
                  </InfoContainer>
                </div>
                {socialData && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "20px 0px",
                    }}
                  >
                    {socialData.twitter && (
                      <InfotitleLink
                        style={{ display: "flex", alignItems: "center" }}
                        href={socialData?.twitter.link}
                        target="_blank"
                      >
                        <TwitterIcon />
                      </InfotitleLink>
                    )}
                    {socialData.telegram && (
                      <InfotitleLink
                        style={{ display: "flex", alignItems: "center" }}
                        href={socialData?.telegram.link}
                        target="_blank"
                      >
                        <TelegramIcon />
                      </InfotitleLink>
                    )}
                    {socialData.whitepaper && (
                      <InfotitleLinkButton
                        href={socialData?.whitepaper.link}
                        target="_blank"
                      >
                        Whitepaper
                      </InfotitleLinkButton>
                    )}
                    <EndContainer style={{ marginRight: "10px" }}>
                      <Dot />
                      Verified
                    </EndContainer>
                    {isOngoing && (
                      <EndContainer>
                        <Dot />
                        On Going
                      </EndContainer>
                    )}
                  </div>
                )}
              </Header>
              {crowdsaleData && (
                <CustomCard>
                  <InfotitleRacing
                    style={{ textAlign: "left", fontSize: "22px" }}
                  >
                    Vesting Info
                  </InfotitleRacing>
                  <Hr />
                  <div>
                    <InfoContainer>
                      <Infosubtitle>Vesting Start</Infosubtitle>
                      <Infotitle style={{ fontSize: "18px" }}>
                        {parseFloat(crowdsaleData.vestingStart) === 0
                          ? "End Manually "
                          : unixTimeConverter(
                              parseFloat(crowdsaleData.vestingStart)
                            )}
                      </Infotitle>
                    </InfoContainer>
                    <InfoContainer>
                      <Infosubtitle>Vesting End</Infosubtitle>
                      <Infotitle style={{ fontSize: "18px" }}>
                        {parseFloat(crowdsaleData.vestingEnd) === 0
                          ? "End Manually "
                          : unixTimeConverter(
                              parseFloat(crowdsaleData.vestingEnd)
                            )}
                      </Infotitle>
                    </InfoContainer>
                    <InfoContainer>
                      <Infosubtitle>Cliff duration</Infosubtitle>
                      <Infotitle
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "18px",
                        }}
                      >
                        {Number(crowdsaleData.cliffDuration) === 0
                          ? "End Manually"
                          : millisecondsToReadable(
                              (
                                parseFloat(
                                  crowdsaleData.cliffDuration.toString()
                                ) * 1000
                              ).toString()
                            )}
                      </Infotitle>
                    </InfoContainer>
                    <InfoContainer>
                      <Infosubtitle>Vesting Period</Infosubtitle>
                      <Infotitle style={{ fontSize: "18px" }}>
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
                      </Infotitle>
                    </InfoContainer>
                  </div>
                  {socialData && socialData.vestingInfo && (
                    <div style={{ marginTop: "20px" }}>
                      <Infotitle>{socialData.vestingInfo}</Infotitle>
                    </div>
                  )}
                </CustomCard>
              )}
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              {isEnded ? (
                <CustomCard style={{ marginBottom: "20px", height: "100%" }}>
                  <InfoContainer style={{ height: "100%" }}>
                    {isVestingEnded && isEnded && crowdsaleData && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Infosubtitle style={{ textAlign: "center" }}>
                          Presale is Finished
                        </Infosubtitle>
                        <TitleText
                          style={{ textAlign: "center", marginTop: "20px" }}
                        >
                          {new Date(
                            parseFloat(crowdsaleData.crowdsaleEnd) * 1000
                          ).toLocaleDateString()}
                        </TitleText>
                      </div>
                    )}
                  </InfoContainer>
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
                      unixEndTimeInSeconds={parseFloat(
                        crowdsaleData.vestingEnd
                      )}
                      info="Vesting has been started and will end in"
                    />
                  )}
                </CustomCard>
              ) : (
                <CustomCard>
                  {!isEnded && crowdsaleData && (
                    <div>
                      <CountdownTimer
                        unixEndTimeInSeconds={
                          isOngoing
                            ? parseFloat(crowdsaleData.crowdsaleEnd)
                            : parseFloat(crowdsaleData.crowdsaleStart)
                        }
                        info={
                          isOngoing
                            ? "Presale is started and will Ends in"
                            : "Presale will Start in"
                        }
                      />
                    </div>
                  )}
                  <ProgressContainer>
                    <ProgressLabel>
                      Progress:{" "}
                      <span
                        style={{
                          color: isDark ? "white" : "#A7A7A7",
                          fontWeight: 600,
                        }}
                      >
                        {crowdSaleContractData.percentage.toFixed(2)} %
                      </span>
                    </ProgressLabel>
                    {/* @ts-ignore */}
                    <BorderLinearProgress
                      variant="determinate"
                      value={crowdSaleContractData.percentage}
                    />
                    <ProgressEndLabel>
                      {`${
                        crowdSaleContractData.progressAmount
                      }/${web3.utils.fromWei(crowdsaleData.hardcap, "ether")}`}
                    </ProgressEndLabel>
                  </ProgressContainer>
                </CustomCard>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            style={{ marginTop: "20px" }}
          >
            <Grid item sm={12} md={6} lg={6}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item sm={12} md={12} lg={12}>
                  <CustomCard>
                    <InfotitleRacing
                      style={{ textAlign: "left", fontSize: "22px" }}
                    >
                      Pool Info
                    </InfotitleRacing>
                    <Hr />
                    <div>
                      <InfoContainer>
                        <Infosubtitle>Starts On</Infosubtitle>
                        <Infotitle style={{ fontSize: "18px" }}>
                          {new Date(
                            parseFloat(crowdsaleData.crowdsaleStart) * 1000
                          ).toLocaleDateString()}
                        </Infotitle>
                      </InfoContainer>
                      <InfoContainer>
                        <Infosubtitle>Ends On</Infosubtitle>
                        <Infotitle
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "18px",
                          }}
                        >
                          {new Date(
                            parseFloat(crowdsaleData.crowdsaleEnd) * 1000
                          ).toLocaleDateString()}
                        </Infotitle>
                      </InfoContainer>
                      {/*{crowdsaleData.rate && (*/}
                      {/*  <InfoContainer>*/}
                      {/*    <Infosubtitle>Rate</Infosubtitle>*/}
                      {/*    <Infotitle style={{ fontSize: "18px" }}>*/}
                      {/*      1 USD:{" "}*/}
                      {/*      {`${web3.utils.fromWei(*/}
                      {/*        crowdSaleContractData.rate,*/}
                      {/*        "ether"*/}
                      {/*      )} ${crowdsaleData.token.symbol}`}*/}
                      {/*    </Infotitle>*/}
                      {/*  </InfoContainer>*/}
                      {/*)}*/}
                      <InfoContainer>
                        <Infosubtitle>HardCap</Infosubtitle>
                        <Infotitle
                          style={{ fontSize: "18px" }}
                        >{`${web3.utils.fromWei(
                          crowdsaleData.hardcap,
                          "ether"
                        )} ${crowdsaleData.token.symbol}`}</Infotitle>
                      </InfoContainer>
                    </div>
                  </CustomCard>
                </Grid>
              </Grid>
              {crowdSaleContractData.isOwner && (
                <CustomCard style={{ marginTop: "30px" }}>
                  <div>
                    <InfotitleRacing
                      style={{ textAlign: "left", fontSize: "22px" }}
                    >
                      White List Users
                    </InfotitleRacing>
                    <Hr style={{ width: "160px" }} />
                  </div>
                  <Subtitle style={{ margin: "20px 0px", textAlign: "left" }}>
                    Enter Comma separated user addresses
                  </Subtitle>
                  <Input
                    placeholder="Enter Addresses"
                    onInputChange={handleAddressChange}
                    value={addresses !== null ? addresses : undefined}
                  />
                  <Button
                    mt="20px"
                    variant="success"
                    disabled={pendingTxForWhiteList}
                    isLoading={pendingTxForWhiteList}
                    onClick={whiteListAddresses}
                  >
                    {pendingTxForWhiteList
                      ? "Transaction Processing"
                      : "WhiteList Addresses"}
                  </Button>
                </CustomCard>
              )}
            </Grid>
            {isEnded ? (
              <Grid item sm={12} md={6} lg={6}>
                <CustomCard style={{ height: "100%" }}>
                  <InfotitleRacing
                    style={{ textAlign: "left", fontSize: "22px" }}
                  >
                    Vesting
                  </InfotitleRacing>
                  <Hr />
                  <VestingContainer>
                    <Grid container spacing={4} justifyContent="center">
                      <Grid item sm={12} md={12} lg={12}>
                        <div>
                          <InfotitleRacing
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Total Invested
                          </InfotitleRacing>
                          <Text
                            fontSize="30px"
                            color="primary"
                            fontWeight="800"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {parseFloat(
                              crowdSaleContractData.totalInvest
                            ).toFixed(2)}
                            <Text fontSize="18px" color="gray" ml="4px">
                              {crowdsaleData.token.symbol}
                            </Text>
                          </Text>
                        </div>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <div>
                          <InfotitleRacing
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Locked
                          </InfotitleRacing>
                          <Text
                            fontSize="30px"
                            color="failure"
                            fontWeight="800"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {parseFloat(crowdSaleContractData.locked).toFixed(
                              2
                            )}
                            <Text fontSize="18px" color="gray" ml="4px">
                              {crowdsaleData.token.symbol}
                            </Text>
                          </Text>
                        </div>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <div>
                          <InfotitleRacing
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Claimable
                          </InfotitleRacing>
                          <Text
                            fontSize="30px"
                            color="success"
                            fontWeight="800"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {parseFloat(
                              crowdSaleContractData.claimable
                            ).toFixed(2)}
                            <Text fontSize="18px" color="gray" ml="4px">
                              {crowdsaleData.token.symbol}
                            </Text>
                          </Text>
                        </div>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <div>
                          <InfotitleRacing
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Claimed
                          </InfotitleRacing>
                          <Text
                            fontSize="30px"
                            color="gray"
                            fontWeight="800"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {parseFloat(crowdSaleContractData.claimed).toFixed(
                              2
                            )}
                            <Text fontSize="18px" color="gray" ml="4px">
                              {crowdsaleData.token.symbol}
                            </Text>
                          </Text>
                        </div>
                      </Grid>
                    </Grid>
                    <Button
                      mt="20px"
                      style={{ opacity: "1" }}
                      disabled={
                        pendingTx ||
                        parseFloat(crowdSaleContractData.claimable) <= 0
                      }
                      isLoading={pendingTx}
                      onClick={claimToken}
                    >
                      {pendingTx ? "Claiming..." : "Claim"}
                    </Button>
                  </VestingContainer>
                </CustomCard>
              </Grid>
            ) : (
              <Grid item sm={12} md={6} lg={6}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item sm={12} md={12} lg={12}>
                    <CustomCard>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <InfotitleRacing
                            style={{ textAlign: "left", fontSize: "22px" }}
                          >
                            Invest
                          </InfotitleRacing>
                          <Hr style={{ width: "100px" }} />
                        </div>
                        <ProgressContainer style={{ marginTop: "0px" }}>
                          <ProgressEndLabel style={{ fontSize: "15px" }}>
                            Your Investment
                          </ProgressEndLabel>
                          <ProgressLabel
                            style={{
                              color: isDark ? "white" : "#A7A7A7",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            {crowdSaleContractData.totalUserPurchased}{" "}
                            {crowdsaleData.token.symbol}
                          </ProgressLabel>
                        </ProgressContainer>
                      </div>
                      <EndContainer
                        style={{
                          color: "#99A3BA",
                          marginTop: "20px",
                          marginBottom: "20px",
                          border: crowdSaleContractData.isWhiteListed
                            ? "2px solid #469D69"
                            : "1px solid red",
                        }}
                      >
                        <Dot
                          style={{
                            background: crowdSaleContractData.isWhiteListed
                              ? "#57CA81"
                              : "red",
                          }}
                        />
                        {crowdSaleContractData.isWhiteListed
                          ? "Your address has been whitelisted"
                          : "Your address is not whitelisted"}
                      </EndContainer>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div>
                          {selectedToken &&
                            selectedToken.symbol &&
                            new BigNumber(
                              selectedToken.userBalance
                            ).toNumber() >= 0 && (
                              <div
                                style={{
                                  marginTop: "25px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginLeft: "10px",
                                  marginRight: "10px",
                                }}
                              >
                                <ProgressEndLabel>Balance</ProgressEndLabel>
                                <ProgressEndLabel>
                                  {parseFloat(
                                    selectedToken.userBalance
                                  ).toFixed(3)}{" "}
                                  {selectedToken.symbol}
                                </ProgressEndLabel>
                              </div>
                            )}
                          <InputContainer>
                            <CustomInput
                              placeholder="0.0"
                              onInputChange={handleInputChange}
                              value={amount}
                            />
                            <Button
                              variant="text"
                              scale="sm"
                              onClick={handleMaxClick}
                            >
                              Max
                            </Button>
                          </InputContainer>
                        </div>
                        {crowdSaleContractData &&
                          crowdSaleContractData.inputTokens &&
                          crowdSaleContractData.inputTokens.length > 0 && (
                            <FormControl
                              variant="filled"
                              className={classes.formControl}
                            >
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                classes={{ icon: classes.icon }}
                                value={selectedToken?.address}
                                style={{ color: "white" }}
                                defaultValue={
                                  crowdSaleContractData.inputTokens[0].address
                                }
                                onChange={selectToken}
                                label="ETH"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {crowdSaleContractData.inputTokens.map(
                                  (eachToken) => (
                                    <MenuItem
                                      value={eachToken.address}
                                      key={eachToken.address}
                                    >
                                      {eachToken.symbol}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          )}
                      </div>
                      <ProgressLabel
                        style={{
                          marginTop: "10px",
                          fontSize: "15px",
                          textAlign: "center",
                        }}
                      >
                        You will receive about{" "}
                        <span
                          style={{
                            color: isDark ? "white" : "#A7A7A7",
                            fontWeight: 600,
                          }}
                        >
                          {selectedToken?.rate} {crowdsaleData.token.symbol}
                        </span>{" "}
                        for{" "}
                        <span
                          style={{
                            color: isDark ? "white" : "#A7A7A7",
                            fontWeight: 600,
                          }}
                        >
                          1 {selectedToken?.symbol}{" "}
                        </span>
                      </ProgressLabel>
                      {crowdSaleContractData.isOwner ? (
                        <Button
                          mt="20px"
                          disabled={pendingTx}
                          isLoading={pendingTx}
                          onClick={purchaseToken}
                        >
                          {pendingTx
                            ? "Transaction Processing"
                            : `Invest Into ${crowdsaleData.token.symbol}`}
                        </Button>
                      ) : (
                        <Button
                          mt="20px"
                          disabled={
                            !crowdSaleContractData.isWhiteListed || pendingTx
                          }
                          isLoading={pendingTx}
                          onClick={purchaseToken}
                        >
                          {pendingTx
                            ? "Transaction Processing"
                            : `Invest Into ${crowdsaleData.token.symbol}`}
                        </Button>
                      )}
                    </CustomCard>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}

export default IVCOPage;
