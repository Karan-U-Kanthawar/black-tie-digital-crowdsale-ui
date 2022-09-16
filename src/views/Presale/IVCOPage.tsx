import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";
import {
  getCrowdsaleContract,
  getERC20Contract,
} from "../../utils/contractHelpers";
import { allowedInputTokens, crowdsale } from "../../config";
import useWeb3Config from "../../hooks/useWeb3Config";
import HeroCard from "../../components/HeroCard";
import { Card, CardSubHeading, CardText } from "../../styles/CardStyles";
import { Contract } from "@ethersproject/contracts";
import erc20Abi from "../../config/constants/abi/erc20.json";
import crowdsaleAbi from "../../config/constants/abi/crowdsale.json";
import ChangeInputTokenRate from "../../components/ChangeInputTokenRate";
import ChangeMaxCrowdsaleAllocation from "../../components/ChangeMaxCrowdsaleAllocation";

export const InputContainer = styled.div`
  position: relative;
`;

interface IIVCOPage {
  id: string;
}

const crowdsaleData = crowdsale;
const allowedInputTokensData = allowedInputTokens;

function IVCOPage({ id }: IIVCOPage) {
  const { account, library, connectWallet } = useWeb3Config();
  const [
    allowedInputTokensWithRateAndBalance,
    setAllowedInputTokensWithRateAndBalance,
  ] = useState(allowedInputTokensData);
  const [tokensRemainingForSale, setTokensRemainingForSale] = useState("0");
  const [maxUserAllocation, setMaxUserAllocation] = useState("100");
  const [userVestedAmount, setUserVestedAmount] = useState("0");
  const [crowdsaleEndTime, setCrowdsaleEndTime] = useState(Date.now() / 1000);
  const [amount, setAmount] = useState("0");
  const [pendingTxn, setPendingTxn] = useState(false);
  const [selectedToken, toggleTokenSelection] = useState(
    allowedInputTokensWithRateAndBalance[0]
  );
  const [showSelectedToken, setShowSelectedToken] = useState<string>(
    allowedInputTokensWithRateAndBalance[0].symbol
  );

  // functions querying the contract
  const getTokensRemainingForSale = useCallback(async () => {
    const crowdSaleContract = getCrowdsaleContract(id);
    const tokensRemainingForSaleInWei =
      await crowdSaleContract.crowdsaleTokenAllocated();
    const tokensRemainingForSaleInEth = ethers.utils.formatEther(
      tokensRemainingForSaleInWei
    );

    setTokensRemainingForSale(tokensRemainingForSaleInEth);
  }, [id]);
  //
  const getUserMaxAllocation = useCallback(async () => {
    const crowdSaleContract = getCrowdsaleContract(id);
    const maxUserAllocationInWei = await crowdSaleContract.maxUserAllocation();
    const maxUserAllocationInEth = ethers.utils.formatEther(
      maxUserAllocationInWei
    );

    setMaxUserAllocation(maxUserAllocationInEth);
  }, [id]);

  const getInputTokenValues = useCallback(async () => {
    const crowdSaleContract = getCrowdsaleContract(id);
    Promise.all(
      allowedInputTokensData.map(async (inputToken) => {
        const inputTokenRate = await crowdSaleContract.inputTokenRate(
          inputToken.address
        );
        return new BigNumber(inputTokenRate.toString())
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed();
      })
    )
      .then((inputTokenRate) => {
        const prevData = allowedInputTokensWithRateAndBalance;
        prevData.forEach((element, index) => {
          element.tokenRate = inputTokenRate[index];
        });

        setAllowedInputTokensWithRateAndBalance(() => prevData);
      })
      .catch((err) =>
        console.error("Error in Promise.all of rate data: ", err)
      );
  }, [allowedInputTokensWithRateAndBalance, id]);
  const getCrowdsaleEndTime = useCallback(async () => {
    const crowdSaleContract = getCrowdsaleContract(id, library);
    const endTimeEthersBg = await crowdSaleContract.crowdsaleEndTime();
    const endTimeNumber = endTimeEthersBg.toNumber();
    setCrowdsaleEndTime(() => endTimeNumber);
  }, [id, library]);
  const getAllUserValues = useCallback(
    async (user: string) => {
      const crowdSaleContract = getCrowdsaleContract(id, library);
      const vestedAmountInWei = await crowdSaleContract.vestedAmount(user);
      const vestedAmountInEth = ethers.utils.formatEther(vestedAmountInWei);

      setUserVestedAmount(() => vestedAmountInEth);
    },
    [id, library]
  );
  const getUserInputTokenValues = useCallback(
    async (user: string) => {
      Promise.all(
        allowedInputTokensData.map(async (inputToken) => {
          const erc20Contract = getERC20Contract(inputToken.address);
          const balanceInWei = await erc20Contract.balanceOf(user);
          return new BigNumber(balanceInWei.toString())
            .div(new BigNumber(10).pow(inputToken.decimals))
            .toString();
        })
      )
        .then((balanceOfInputTokens) => {
          const prevData = allowedInputTokensWithRateAndBalance;
          prevData.forEach((element, index) => {
            element.userBalance = balanceOfInputTokens[index];
          });

          setAllowedInputTokensWithRateAndBalance(() => prevData);
        })
        .catch((err) =>
          console.error("Error in Promise.all of user balance data: ", err)
        );
    },
    [allowedInputTokensWithRateAndBalance]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  const handleMaxClick = () => {
    setAmount(selectedToken.userBalance);
  };
  const handleEndCrowdsale = async () => {
    try {
      if (!account) return;
      setPendingTxn(() => true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crowdSaleContract = await new Contract(id, crowdsaleAbi, signer);
      const endingCrowdsale = await crowdSaleContract.endCrowdsale();
      await endingCrowdsale.wait();
      setPendingTxn(() => false);
    } catch (error) {
      setPendingTxn(() => false);
      console.error("Error while trying to end crowdsale: ", error);
    }
  };
  const handleShowSelectedToken = (event: SelectChangeEvent) => {
    const selectedInputToken = allowedInputTokensData.filter(
      (inputTokens) => inputTokens.symbol === event.target.value
    );
    setShowSelectedToken(selectedInputToken[0].symbol);
    toggleTokenSelection(selectedInputToken[0]);
  };
  const purchaseToken = async () => {
    if (account) {
      try {
        setPendingTxn(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const erc20ContractWithSigner = await new Contract(
          selectedToken.address,
          erc20Abi,
          signer
        );
        const crowdSaleContract = await new Contract(id, crowdsaleAbi, signer);

        const inputTokenAllowanceInWei =
          await erc20ContractWithSigner.allowance(account, id);
        const inputTokenAmountInWei = ethers.utils.parseUnits(
          amount.toString(),
          selectedToken.decimals
        );

        // Approval logic
        if (
          new BigNumber(inputTokenAllowanceInWei.toString()).isLessThan(
            inputTokenAmountInWei.toString()
          )
        ) {
          const approvalTx = await erc20ContractWithSigner.approve(
            id,
            inputTokenAmountInWei
          );
          await approvalTx.wait();
        }
        await crowdSaleContract.purchaseToken(
          selectedToken.address,
          inputTokenAmountInWei
        );
        setPendingTxn(false);
      } catch (error) {
        setPendingTxn(false);
        console.error("Error while trying to purchase token: ", error);
      }
    }
  };

  useEffect(() => {
    getTokensRemainingForSale().catch((error) =>
      console.error("Error while getting crowdsale contract info: ", error)
    );
    getUserMaxAllocation().catch((error) =>
      console.error("Error while getting crowdsale contract info: ", error)
    );
    getInputTokenValues().catch((error) =>
      console.error("Error while setting input token rates: ", error)
    );
    getCrowdsaleEndTime().catch((error) =>
      console.error("Error while getting crowdsale end time: ", error)
    );
  }, [
    getCrowdsaleEndTime,
    getInputTokenValues,
    getTokensRemainingForSale,
    getUserMaxAllocation,
  ]);

  useEffect(() => {
    if (account) {
      getAllUserValues(account).catch((error) =>
        console.error(
          "Error while getting user values from crowdsale contract: ",
          error
        )
      );
      getUserInputTokenValues(account).catch((error) =>
        console.error(
          "Error while getting user values for the input tokens: ",
          error
        )
      );
    }
  }, [account, getAllUserValues, getUserInputTokenValues]);

  return (
    <Grid container spacing={2}>
      <Grid item lg={3} md={0}></Grid>
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <Stack rowGap={2}>
          <HeroCard
            crowdsaleData={crowdsaleData}
            totalSupply={tokensRemainingForSale}
          />
          {new BigNumber(crowdsaleEndTime).isGreaterThanOrEqualTo(
            Date.now() / 1000
          ) || new BigNumber(crowdsaleEndTime).isEqualTo(0) ? (
            <>
              {crowdsaleData.owner === account && (
                <>
                  <ChangeMaxCrowdsaleAllocation
                    id={id}
                    account={account}
                    crowdsaleData={crowdsaleData}
                    pendingTxn={pendingTxn}
                    setPendingTxn={setPendingTxn}
                    tokensRemaining={tokensRemainingForSale}
                  />
                  <ChangeInputTokenRate
                    id={id}
                    account={account}
                    crowdsaleData={crowdsaleData}
                    selectedToken={selectedToken}
                    showSelectedToken={showSelectedToken}
                    handleShowSelectedToken={handleShowSelectedToken}
                    allowedInputTokensWithRateAndBalance={
                      allowedInputTokensWithRateAndBalance
                    }
                    pendingTxn={pendingTxn}
                    setPendingTxn={setPendingTxn}
                  />
                  <Card>
                    <Button
                      variant={"contained"}
                      disabled={pendingTxn}
                      onClick={handleEndCrowdsale}
                    >
                      End Crowdsale
                    </Button>
                  </Card>
                </>
              )}
              <Card>
                <Stack rowGap={3}>
                  <Stack>
                    {selectedToken &&
                      selectedToken.symbol &&
                      account &&
                      new BigNumber(
                        selectedToken.userBalance
                      ).isGreaterThanOrEqualTo(0) && (
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
                  {false && Number(amount) > Number(maxUserAllocation) && (
                    <Alert variant="outlined" severity="warning">
                      Cannot deposit more than {maxUserAllocation}{" "}
                      {selectedToken.symbol}
                    </Alert>
                  )}

                  {
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
                        {allowedInputTokensWithRateAndBalance.map(
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
                  }
                  {account && (
                    <Stack direction={"row"} justifyContent={"center"}>
                      <CardSubHeading>You will receive about</CardSubHeading>
                      <CardText style={{ margin: "0 8px" }}>
                        {selectedToken.tokenRate} {crowdsaleData.token.symbol}
                      </CardText>
                      <CardSubHeading>for</CardSubHeading>
                      <CardSubHeading style={{ margin: "0 8px" }}>
                        1 {selectedToken.symbol}
                      </CardSubHeading>
                    </Stack>
                  )}

                  {account ? (
                    <Button
                      variant={"contained"}
                      disabled={
                        pendingTxn
                      }
                      onClick={purchaseToken}
                    >
                      Invest into {crowdsaleData.token.symbol}
                    </Button>
                  ) : (
                    <Button variant={"outlined"} onClick={connectWallet}>
                      Connect to Wallet
                    </Button>
                  )}
                </Stack>
              </Card>
            </>
          ) : (
            <Card>
              <Stack>
                <Stack justifyContent={"center"} alignItems={"center"} gap={1}>
                  <CardSubHeading>Crowdsale has ended</CardSubHeading>
                </Stack>
              </Stack>
            </Card>
          )}

          {account && (
            <Card>
              <Stack rowGap={3}>
                <Stack justifyContent={"center"} alignItems={"center"} gap={1}>
                  <CardSubHeading>Total tokens bought</CardSubHeading>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <CardText>{Number(userVestedAmount).toFixed(3)}</CardText>
                    <CardSubHeading>
                      {crowdsaleData.token.symbol}
                    </CardSubHeading>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          )}
        </Stack>
      </Grid>
      <Grid item lg={3} md={0}></Grid>
    </Grid>
  );
}

export default IVCOPage;
