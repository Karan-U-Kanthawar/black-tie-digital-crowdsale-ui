import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Grid,
  MenuItem,
  FormControl,
  Select,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { ethers, Contract } from "ethers";
import tokenAbi from "../../config/constants/abi/token.json";
import { getERC20Contract } from "../../utils/contractHelpers";
import { useCrowdsaleContract } from "../../hooks/useContract";
import {
  allowedInputTokens,
  crowdsale,
  ICrowdsaleContractData,
} from "../../config";
import VestingInfoCard from "../../components/VestingInfoCard";
import PoolInfoCard from "../../components/PoolInfoCard";
import useWeb3Config from "../../components/Menu/useWeb3Config";
import HeroCard from "../../components/HeroCard";
import TimerCard from "../../components/TimerCard";
import {
  Card,
  CardHeading,
  CardSubHeading,
  CardText,
} from "../../styles/CardStyles";

const Hr = styled.div`
  background: ${(props) => props.theme.palette.primary.main};
  border-radius: 1px;
  transform: matrix(1, 0, 0, -1, 0, 0);
  width: 100%;
  height: 2px;
  margin: 10px 0 20px 0;
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

function IVCOPage({ id }: IIVCOPage) {
  const { account } = useWeb3Config();
  const crowdsaleData = crowdsale;
  const allowedInputTokensData = allowedInputTokens;
  const [amount, setAmount] = useState("0");
  const [addresses, setAddresses] = useState<null | string>(null);
  const [pendingTx, setPendingTx] = useState(false);
  const [pendingTxForWhiteList, setPendingTxForWhiteList] = useState(false);
  const [selectedToken, toggleTokenSelection] = useState<IInputTokens>();
  const [crowdSaleContractData, setCrowdSaleContractData] =
    useState<ICrowdsaleContractData>({
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

  const isDark = true;

  useEffect(() => {
    const getCrowdSaleData = async (account: string) => {
      if (crowdsaleData) {
        const inputTokens: IInputTokens[] = [];
        const isWhiteListedResp = await crowdSaleContract.whitelistedAddress(
          account
        );
        const remainingInEther = ethers.utils.formatEther(
          crowdsaleData.tokenRemainingForSale
        );
        const getTotalPurchasedAmount = await crowdSaleContract.vestedAmount(
          account
        );
        const purchasedInEther = ethers.utils.formatEther(
          getTotalPurchasedAmount
        );
        const vestingSchedule =
          await crowdSaleContract.vestingScheduleForBeneficiary(account);
        const totalInvest = ethers.utils.formatEther(vestingSchedule._amount);
        const locked = ethers.utils.formatEther(
          vestingSchedule._remainingBalance
        );
        const claimable = ethers.utils.formatEther(
          vestingSchedule._availableForDrawDown
        );
        const claimed = ethers.utils.formatEther(vestingSchedule._totalDrawn);
        let hardCap = 0;
        let progressAmount = 0;
        let percentage = 0;
        const vestingTimer =
          parseFloat(crowdsaleData.vestingStart) +
          parseFloat(crowdsaleData.cliffDuration);
        if (crowdsaleData && crowdsaleData.hardcap) {
          hardCap = parseFloat(ethers.utils.formatEther(crowdsaleData.hardcap));
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
              const contractDetails = getERC20Contract(eachToken.address);
              const userBalance = await contractDetails.balanceOf(account);
              const balanceInEther = new BigNumber(userBalance.toString()).div(
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
      getCrowdSaleData(account).catch((e) =>
        console.error(
          "Error while getting extra crowdsale & input token values: ",
          e
        )
      );
    }
    const getTotalSupply = async () => {
      if (crowdsaleData && crowdsaleData.token && crowdsaleData.token.address) {
        const contractDetails = await getERC20Contract(
          crowdsaleData.token.address
        );
        const totalSupplyResp = await contractDetails.totalSupply();
        const supplyInEther = ethers.utils.formatEther(totalSupplyResp);
        setTotalSupply(supplyInEther);
      }
    };
    getTotalSupply().catch((e) =>
      console.error("Error while getting total supply: ", e)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

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
    if (account) {
      try {
        setPendingTx(true);
        if (selectedToken === undefined) return;
        const contractDetails = getERC20Contract(selectedToken.address);
        const allowance = await contractDetails.allowance(account, id);
        const approvalAmount = ethers.utils.parseUnits(amount.toString(), 18);
        if (
          new BigNumber(allowance.toString()).isLessThan(
            approvalAmount.toString()
          )
        ) {
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
          await crowdSaleContract.purchaseToken(
            selectedToken.address,
            amountInVei.toString()
          );
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
          await crowdSaleContract.purchaseToken(
            selectedToken.address,
            amountInVei.toString()
          );
          setPendingTx(false);
        }
      } catch (error) {
        setPendingTx(false);
        console.error(error);
      }
    }
  };
  const claimToken = async () => {
    try {
      setPendingTx(true);
      await crowdSaleContract.drawDown();
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
      const isWhiteListEnabled = await crowdSaleContract.whitelistingEnabled();
      if (!isWhiteListEnabled) {
        await crowdSaleContract.enableWhitelisting();
      }
      await crowdSaleContract.whitelistUsers(trimmedAddresses);
      setPendingTxForWhiteList(false);
    } catch (error) {
      console.error(error);
      setPendingTxForWhiteList(false);
    }
  };

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

  return (
    <Grid container spacing={2} paddingBottom={"100px"}>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Stack rowGap={2}>
          <HeroCard crowdsaleData={crowdsaleData} totalSupply={totalSupply} />
          <VestingInfoCard crowdsaleData={crowdsaleData} />
          <PoolInfoCard crowdsaleData={crowdsaleData} />
        </Stack>
      </Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Stack rowGap={2}>
          <TimerCard
            isEnded={isEnded}
            isVestingEnded={isVestingEnded}
            isVestingYetToStart={isVestingYetToStart}
            isVestingStarted={isVestingStarted}
            isOngoing={isOngoing}
            crowdsaleData={crowdsaleData}
            crowdsaleContractData={crowdSaleContractData}
          />

          <>
            {crowdSaleContractData.isOwner && (
              <Card>
                <div>
                  <CardHeading>White-List Users</CardHeading>
                  <Hr />
                </div>
                <TextField
                  label={"Addresses to whitelist"}
                  placeholder={"Enter addresses"}
                  type={"text"}
                  onChange={handleAddressChange}
                  value={addresses !== null ? addresses : undefined}
                />
                <Button
                  variant={"contained"}
                  disabled={pendingTxForWhiteList}
                  onClick={whiteListAddresses}
                  sx={{ marginTop: "20px" }}
                >
                  Whitelist Addresses
                </Button>
              </Card>
            )}
            {isEnded ? (
              <Card>
                <CardHeading>Vesting</CardHeading>
                <Hr />
                <Stack rowGap={3}>
                  <Stack justifyContent={"center"} alignItems={"center"}>
                    <CardSubHeading>Total Invested</CardSubHeading>
                    <Stack direction={"row"}>
                      <CardText>
                        {parseFloat(crowdSaleContractData.totalInvest).toFixed(
                          2
                        )}
                      </CardText>
                      <CardSubHeading>
                        {crowdsaleData.token.symbol}
                      </CardSubHeading>
                    </Stack>
                  </Stack>
                  <Stack
                    direction={"row"}
                    flexWrap={"wrap"}
                    spacing={2}
                    justifyContent={"space-around"}
                  >
                    <Stack justifyContent={"center"} alignItems={"center"}>
                      <CardSubHeading>Locked</CardSubHeading>
                      <Stack direction={"row"}>
                        <CardText>
                          {parseFloat(crowdSaleContractData.locked).toFixed(2)}
                        </CardText>
                        <CardSubHeading>
                          {crowdsaleData.token.symbol}
                        </CardSubHeading>
                      </Stack>
                    </Stack>
                    <Stack justifyContent={"center"} alignItems={"center"}>
                      <CardSubHeading>Claimable</CardSubHeading>
                      <Stack direction={"row"}>
                        <CardText>
                          {parseFloat(crowdSaleContractData.claimable).toFixed(
                            2
                          )}
                        </CardText>
                        <CardSubHeading>
                          {crowdsaleData.token.symbol}
                        </CardSubHeading>
                      </Stack>
                    </Stack>
                    <Stack justifyContent={"center"} alignItems={"center"}>
                      <CardSubHeading>Claimed</CardSubHeading>
                      <Stack direction={"row"}>
                        <CardText>
                          {parseFloat(crowdSaleContractData.claimed).toFixed(2)}
                        </CardText>
                        <CardSubHeading>
                          {crowdsaleData.token.symbol}
                        </CardSubHeading>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack>
                    <Button
                      variant={"outlined"}
                      disabled={
                        pendingTx ||
                        parseFloat(crowdSaleContractData.claimable) <= 0
                      }
                      onClick={claimToken}
                    >
                      Claim
                    </Button>
                  </Stack>
                </Stack>
              </Card>
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
                          {/*<InputContainer>*/}
                          {/*  <input*/}
                          {/*    placeholder="0.0"*/}
                          {/*    onChange={handleInputChange}*/}
                          {/*    value={amount}*/}
                          {/*  />*/}
                          {/*  <button onClick={handleMaxClick}>Max</button>*/}
                          {/*</InputContainer>*/}
                          <TextField
                            placeholder="0.0"
                            onChange={handleInputChange}
                            value={amount}
                          />
                          <Button variant={"outlined"} onClick={handleMaxClick}>
                            Max
                          </Button>
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
                        <Button disabled={pendingTx} onClick={purchaseToken}>
                          {pendingTx
                            ? "Transaction Processing"
                            : `Invest Into ${crowdsaleData.token.symbol}`}
                        </Button>
                      ) : (
                        <Button
                          disabled={
                            !crowdSaleContractData.isWhiteListed || pendingTx
                          }
                          onClick={purchaseToken}
                        >
                          {pendingTx
                            ? "Transaction Processing"
                            : `Invest Into ${crowdsaleData.token.symbol}`}
                        </Button>
                      )}
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default IVCOPage;
