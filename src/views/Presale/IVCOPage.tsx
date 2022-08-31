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
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { ethers, Contract } from "ethers";
import tokenAbi from "../../config/constants/abi/token.json";
import { getERC20Contract } from "../../utils/contractHelpers";
import { useCrowdsaleContract } from "../../hooks/useContract";
import {
  allowedInputTokens,
  crowdsale,
  ICrowdsaleContractData,
  IInputTokens,
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
  Hr,
} from "../../styles/CardStyles";

interface ColorProps {
  isWhitelisted?: boolean;
}

const InputContainer = styled.div`
  position: relative;
`;

const ColorContainer = styled.div<ColorProps>`
  color: ${(props) => props.theme.palette.text.disabled};
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  white-space: nowrap;
  border: 2px solid
    ${(props) =>
      props.isWhitelisted
        ? props.theme.palette.success.main
        : props.theme.palette.error.main};
`;

const Dot = styled.div<{ isWhitelisted: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) =>
    props.isWhitelisted
      ? props.theme.palette.success.main
      : props.theme.palette.error.main};
  margin-right: 6px;
`;

interface IIVCOPage {
  id: string;
}

function IVCOPage({ id }: IIVCOPage) {
  const { account, library } = useWeb3Config();
  const crowdsaleData = crowdsale;
  const allowedInputTokensData = allowedInputTokens;
  const [amount, setAmount] = useState("0");
  const [addresses, setAddresses] = useState<null | string>(null);
  const [pendingTx, setPendingTx] = useState(false);
  const [pendingTxForWhiteList, setPendingTxForWhiteList] = useState(false);
  const [selectedToken, toggleTokenSelection] = useState<IInputTokens>();
  const [showSelectedToken, setShowSelectedToken] = useState<string>(
    allowedInputTokensData[0].symbol
  );
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
  const crowdSaleContract = useCrowdsaleContract(id, library);

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
          ...newCrowdSaleData,
        };

        setCrowdSaleContractData(combinedObj);
        if (
          crowdsaleData &&
          allowedInputTokensData &&
          allowedInputTokensData?.length > 0
        ) {
          await Promise.all(
            allowedInputTokensData.map(async (eachToken: any) => {
              const contractDetails = getERC20Contract(
                eachToken.address,
                library
              );
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
            ...newCrowdSaleData,
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

  const handleShowSelectedToken = (event: SelectChangeEvent) => {
    const selectedInputToken = crowdSaleContractData.inputTokens.filter(
      (inputTokens) => inputTokens.symbol === event.target.value
    );
    setShowSelectedToken(selectedInputToken[0].symbol);
    toggleTokenSelection(selectedInputToken[0]);
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
              <Card>
                <Stack rowGap={3}>
                  <Stack
                    direction={"row"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems="center"
                  >
                    <Stack>
                      <CardHeading>Invest</CardHeading>
                      <Hr />
                    </Stack>
                    <Card>
                      <CardSubHeading style={{ fontSize: "15px" }}>
                        Your Investment
                      </CardSubHeading>
                      <CardText>
                        {crowdSaleContractData.totalUserPurchased}{" "}
                        {crowdsaleData.token.symbol}
                      </CardText>
                    </Card>
                  </Stack>
                  <ColorContainer
                    isWhitelisted={crowdSaleContractData.isWhiteListed}
                  >
                    <Dot isWhitelisted={crowdSaleContractData.isWhiteListed} />
                    {crowdSaleContractData.isWhiteListed
                      ? "Your address has been whitelisted"
                      : "Your address is not whitelisted"}
                  </ColorContainer>

                  <Stack>
                    {selectedToken &&
                      selectedToken.symbol &&
                      new BigNumber(selectedToken.userBalance).toNumber() >=
                        0 && (
                        <Stack
                          direction={"row"}
                          margin={"20px 0"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                        >
                          <CardSubHeading>Balance</CardSubHeading>
                          <CardText>
                            {parseFloat(selectedToken.userBalance).toFixed(3)}{" "}
                            {selectedToken.symbol}
                          </CardText>
                        </Stack>
                      )}
                    <InputContainer>
                      <TextField
                        label={"Amount"}
                        value={amount}
                        placeholder={"Amount to enter"}
                        variant={"outlined"}
                        onChange={handleInputChange}
                        size={"medium"}
                        aria-placeholder={"0.0"}
                        fullWidth
                      />
                      <Button
                        variant="outlined"
                        onClick={handleMaxClick}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "15%",
                        }}
                      >
                        Max
                      </Button>
                    </InputContainer>
                  </Stack>
                  {crowdSaleContractData &&
                    crowdSaleContractData.inputTokens &&
                    crowdSaleContractData.inputTokens.length > 0 && (
                      <FormControl>
                        <InputLabel id={"select-input-token-label"}>
                          Input token
                        </InputLabel>
                        <Select
                          labelId="select-input-token-label"
                          id="select-input-token"
                          value={showSelectedToken}
                          onChange={handleShowSelectedToken}
                          label="Input token"
                        >
                          {crowdSaleContractData.inputTokens.map(
                            (inputToken) => (
                              <MenuItem
                                value={inputToken.symbol}
                                key={inputToken.address}
                              >
                                {inputToken.symbol}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                    )}
                  <Stack direction={"row"} justifyContent={"center"}>
                    <CardSubHeading>You will receive about</CardSubHeading>
                    <CardText style={{ margin: "0 8px" }}>
                      {selectedToken?.rate} {crowdsaleData.token.symbol}
                    </CardText>
                    <CardSubHeading>for</CardSubHeading>
                    <CardSubHeading style={{ margin: "0 8px" }}>
                      1 {selectedToken?.symbol}
                    </CardSubHeading>
                  </Stack>

                  {crowdSaleContractData.isOwner ? (
                    <Button
                      variant={"contained"}
                      disabled={pendingTx}
                      onClick={purchaseToken}
                    >
                      Invest into {crowdsaleData.token.symbol}
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        !crowdSaleContractData.isWhiteListed || pendingTx
                      }
                      onClick={purchaseToken}
                      variant={"contained"}
                    >
                      Invest into {crowdsaleData.token.symbol}
                    </Button>
                  )}
                </Stack>
              </Card>
            )}
          </>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default IVCOPage;
