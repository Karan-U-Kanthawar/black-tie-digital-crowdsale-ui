import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Grid,
  MenuItem,
  FormControl,
  Select,
  LinearProgress,
  Paper,
} from "@mui/material";
import Web3 from "web3";
import { ethers, Contract } from "ethers";
import tokenAbi from "../../config/constants/abi/token.json";
import CopyToClipboard from "../../components/CopyToClipboard";
import { getERC20Contract } from "../../utils/contractHelpers";
import { useCrowdsaleContract } from "../../hooks/useContract";
import CountdownTimer from "../../components/CountdownTimer";
import {
  allowedInputTokens,
  crowdsale,
  setMetamaskGasPrice,
} from "../../config";
import useActiveWeb3React from "../../hooks";
import SocialsContainer from "../../components/SocialsContainer";
import VestingInfoCard from "../../components/VestingInfoCard";
import PoolInfoCard from "../../components/PoolInfoCard";

const Card = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
// const CardBody = styled.div``;
const Hr = styled.div`
  background: ${(props) => props.theme.palette.primary.main};
  border-radius: 1px;
  transform: matrix(1, 0, 0, -1, 0, 0);
  width: 100%;
  height: 2px;
  margin: 10px 0 20px 0;
`;
const CardHeading = styled.h2`
  font-weight: 600;
  text-transform: uppercase;
  text-align: left;
  font-size: 22px;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const CardSubHeading = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.palette.text.disabled};
`;
const CardText = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.secondary};
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
  color: white;
`;
const Subtitle = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: #a7a7a7;
  margin-top: 12px;
`;
const TitleText = styled.p`
  font-size: 25px;
  line-height: 28px;
  color: white;
  text-align: left;
  font-weight: 600;
`;
const EndContainer = styled.div`
  background-color: black;
  border: 2px solid #469d69;
  box-sizing: border-box;
  border-radius: 14px;
  color: white;
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
  background: black;
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
  background: #000;
  border: 1px solid white;
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
const Text = styled.p``;
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
  return (
    <>
      {crowdsaleData ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            <Grid item sm={12} md={6} lg={6}>
              <Header style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    width: "100%",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={crowdsaleData.token?.url || ""}
                    alt={crowdsaleData.token.symbol}
                    width="70px"
                    height="70px"
                    style={{ marginBottom: "10px", marginRight: "20px" }}
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
                  <CardText
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "18px",
                    }}
                  >
                    {`${crowdsaleData.token.address.slice(
                      0,
                      4
                    )}...${crowdsaleData.token.address.slice(
                      crowdsaleData.token.address.length - 4
                    )}`}
                    <CopyToClipboard toCopy={crowdsaleData.token.address} />
                  </CardText>
                  <CardRow style={{ marginBottom: "0px" }}>
                    <CardSubHeading style={{ fontSize: "18px" }}>
                      Total Supply:{" "}
                    </CardSubHeading>
                    <CardText style={{ fontSize: "18px", marginLeft: "5px" }}>
                      {" "}
                      {convertToInternationalCurrencySystem(totalSupply)}
                    </CardText>
                  </CardRow>
                </div>
                <SocialsContainer />
              </Header>
              {crowdsaleData && (
                <VestingInfoCard crowdsaleData={crowdsaleData} />
              )}
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              {isEnded ? (
                <Card style={{ marginBottom: "20px", height: "100%" }}>
                  <CardRow style={{ height: "100%" }}>
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
                        <CardSubHeading style={{ textAlign: "center" }}>
                          Presale is Finished
                        </CardSubHeading>
                        <TitleText
                          style={{ textAlign: "center", marginTop: "20px" }}
                        >
                          {new Date(
                            parseFloat(crowdsaleData.crowdsaleEnd) * 1000
                          ).toLocaleDateString()}
                        </TitleText>
                      </div>
                    )}
                  </CardRow>
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
                </Card>
              ) : (
                <Card>
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
                            ? "Presale has started and will end in"
                            : "Presale will start in"
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
                    <LinearProgress
                      variant="determinate"
                      value={crowdSaleContractData.percentage}
                      color={"secondary"}
                    />
                    <ProgressEndLabel>
                      {`${
                        crowdSaleContractData.progressAmount
                      }/${web3.utils.fromWei(crowdsaleData.hardcap, "ether")}`}
                    </ProgressEndLabel>
                  </ProgressContainer>
                </Card>
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
                  <PoolInfoCard crowdsaleData={crowdsaleData} />
                </Grid>
              </Grid>
              {crowdSaleContractData.isOwner && (
                <Card style={{ marginTop: "30px" }}>
                  <div>
                    <CardHeading
                      style={{ textAlign: "left", fontSize: "22px" }}
                    >
                      White List Users
                    </CardHeading>
                    <Hr style={{ width: "160px" }} />
                  </div>
                  <Subtitle style={{ margin: "20px 0px", textAlign: "left" }}>
                    Enter Comma separated user addresses
                  </Subtitle>
                  <input
                    placeholder="Enter Addresses"
                    onChange={handleAddressChange}
                    value={addresses !== null ? addresses : undefined}
                  />
                  <button
                    disabled={pendingTxForWhiteList}
                    onClick={whiteListAddresses}
                  >
                    {pendingTxForWhiteList
                      ? "Transaction Processing"
                      : "WhiteList Addresses"}
                  </button>
                </Card>
              )}
            </Grid>
            {isEnded ? (
              <Grid item sm={12} md={6} lg={6}>
                <Card style={{ height: "100%" }}>
                  <CardHeading style={{ textAlign: "left", fontSize: "22px" }}>
                    Vesting
                  </CardHeading>
                  <Hr />
                  <VestingContainer>
                    <Grid container spacing={4} justifyContent="center">
                      <Grid item sm={12} md={12} lg={12}>
                        <div>
                          <CardHeading
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Total Invested
                          </CardHeading>
                          <Text
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {parseFloat(
                              crowdSaleContractData.totalInvest
                            ).toFixed(2)}
                            <Text>{crowdsaleData.token.symbol}</Text>
                          </Text>
                        </div>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <div>
                          <CardHeading
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Locked
                          </CardHeading>
                          <Text>
                            {parseFloat(crowdSaleContractData.locked).toFixed(
                              2
                            )}
                            <Text>{crowdsaleData.token.symbol}</Text>
                          </Text>
                        </div>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <div>
                          <CardHeading
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Claimable
                          </CardHeading>
                          <Text>
                            {parseFloat(
                              crowdSaleContractData.claimable
                            ).toFixed(2)}
                            <Text>{crowdsaleData.token.symbol}</Text>
                          </Text>
                        </div>
                      </Grid>
                      <Grid item sm={12} md={6} lg={4}>
                        <div>
                          <CardHeading
                            style={{ textAlign: "center", fontSize: "19px" }}
                          >
                            Claimed
                          </CardHeading>
                          <Text>
                            {parseFloat(crowdSaleContractData.claimed).toFixed(
                              2
                            )}
                            <Text>{crowdsaleData.token.symbol}</Text>
                          </Text>
                        </div>
                      </Grid>
                    </Grid>
                    <button
                      style={{ opacity: "1" }}
                      disabled={
                        pendingTx ||
                        parseFloat(crowdSaleContractData.claimable) <= 0
                      }
                      onClick={claimToken}
                    >
                      {pendingTx ? "Claiming..." : "Claim"}
                    </button>
                  </VestingContainer>
                </Card>
              </Grid>
            ) : (
              <Grid item sm={12} md={6} lg={6}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item sm={12} md={12} lg={12}>
                    <Card>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <CardHeading
                            style={{ textAlign: "left", fontSize: "22px" }}
                          >
                            Invest
                          </CardHeading>
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
                            <input
                              placeholder="0.0"
                              onChange={handleInputChange}
                              value={amount}
                            />
                            <button onClick={handleMaxClick}>Max</button>
                          </InputContainer>
                        </div>
                        {crowdSaleContractData &&
                          crowdSaleContractData.inputTokens &&
                          crowdSaleContractData.inputTokens.length > 0 && (
                            <FormControl variant="filled">
                              <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={selectedToken?.address}
                                style={{ color: "white" }}
                                defaultValue={
                                  crowdSaleContractData.inputTokens[0].address
                                }
                                // onChange={selectToken}
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
                        <button disabled={pendingTx} onClick={purchaseToken}>
                          {pendingTx
                            ? "Transaction Processing"
                            : `Invest Into ${crowdsaleData.token.symbol}`}
                        </button>
                      ) : (
                        <button
                          disabled={
                            !crowdSaleContractData.isWhiteListed || pendingTx
                          }
                          onClick={purchaseToken}
                        >
                          {pendingTx
                            ? "Transaction Processing"
                            : `Invest Into ${crowdsaleData.token.symbol}`}
                        </button>
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default IVCOPage;
