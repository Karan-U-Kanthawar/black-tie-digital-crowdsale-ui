import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
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
import LoadingButton from "@mui/lab/LoadingButton";
import { ethers } from "ethers";
import {
  getCrowdsaleContract,
  getERC20Contract,
} from "../../utils/contractHelpers";
import {
  allowedInputTokens,
  crowdsale,
  ROUND_OFF_DECIMALS_TO,
} from "../../config";
import HeroCard from "../../components/HeroCard";
import { Card, CardSubHeading, CardText } from "../../styles/CardStyles";
import { Contract } from "@ethersproject/contracts";
import erc20Abi from "../../config/constants/abi/erc20.json";
import crowdsaleAbi from "../../config/constants/abi/crowdsale.json";
import ChangeInputTokenRate from "../../components/ChangeInputTokenRate";
import ChangeMaxCrowdsaleAllocation from "../../components/ChangeMaxCrowdsaleAllocation";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import StyledModal from "../../components/StyledModal";
import ChangeMaxUserAllocation from "../../components/ChangeMaxUserAllocation";
import WithdrawFunds from "../../components/WithdrawFunds";
import TransferFunds from "../../components/TransferFunds";

export const InputContainer = styled.div`
  position: relative;
`;

export const OwnerCard = styled(Card)`
  width: 100%;
  max-width: 500px;

  @media (max-width: 850px) {
    max-width: 100%;
  }
`;

interface IIVCOPage {
  id: string;
  handleConnectWalletModalOpen: () => void;
}

const crowdsaleData = crowdsale;
const allowedInputTokensData = allowedInputTokens;

function IVCOPage({ id, handleConnectWalletModalOpen }: IIVCOPage) {
  const { account, library } = useActiveWeb3React();
  const [ownerAddress, setOwnerAddress] = useState(crowdsale.owner);
  const [
    allowedInputTokensWithRateAndBalance,
    setAllowedInputTokensWithRateAndBalance,
  ] = useState(allowedInputTokensData);
  const [tokensRemainingForSale, setTokensRemainingForSale] = useState("0");
  const [currMaxUserAllocation, setCurrMaxUserAllocation] = useState("0");
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
  const [purchasePending, setPurchasePending] = useState({
    loading: false,
    success: false,
    failure: false,
  });
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const handleOpenPurchaseModal = () => setOpenPurchaseModal(true);
  const handleClosePurchaseModal = () => setOpenPurchaseModal(false);

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

  const getOwner = useCallback(async () => {
    const crowdSaleContract = getCrowdsaleContract(id);
    const owner = await crowdSaleContract.owner();
    setOwnerAddress(owner);
  }, [id]);

  const getCurrMaxUserAllocation = useCallback(async () => {
    const crowdSaleContract = getCrowdsaleContract(id);
    const maxUserAllocationInWei = await crowdSaleContract.maxUserAllocation();
    const maxUserAllocationInEth = ethers.utils.formatEther(
      maxUserAllocationInWei
    );

    setCurrMaxUserAllocation(maxUserAllocationInEth);
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
      const provider = new ethers.providers.Web3Provider(
        //  @ts-ignore
        (window as WindowChain).ethereum
      );
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
        handleOpenPurchaseModal();
        setPurchasePending({ loading: true, success: false, failure: false });
        const provider = new ethers.providers.Web3Provider(
          //  @ts-ignore
          (window as WindowChain).ethereum
        );
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
          const approvalTxn = await erc20ContractWithSigner.approve(
            id,
            inputTokenAmountInWei
          );
          await approvalTxn.wait();
        }
        const purchaseTxn = await crowdSaleContract.purchaseToken(
          selectedToken.address,
          inputTokenAmountInWei
        );
        await purchaseTxn.wait();
        setTimeout(async () => {
          const vestedAmountInWei = await crowdSaleContract.vestedAmount(
            account
          );
          const vestedAmountInEth = ethers.utils.formatEther(vestedAmountInWei);
          setUserVestedAmount(() => vestedAmountInEth);
        }, 20000);
        setPurchasePending({ loading: false, success: true, failure: false });
      } catch (error) {
        setPurchasePending({ loading: false, success: false, failure: true });
        console.error("Error while trying to purchase token: ", error);
      }
    }
  };

  useEffect(() => {
    getTokensRemainingForSale().catch((error) =>
      console.error("Error while getting crowdsale contract info: ", error)
    );
    getOwner().catch((error) =>
      console.error("Error while getting owner address: ", error)
    );
    getCurrMaxUserAllocation().catch((error) =>
      console.error("Error while getting max user allocation: ", error)
    );
    getInputTokenValues().catch((error) =>
      console.error("Error while setting input token rates: ", error)
    );
    getCrowdsaleEndTime().catch((error) =>
      console.error("Error while getting crowdsale end time: ", error)
    );
  }, [
    getCrowdsaleEndTime,
    getCurrMaxUserAllocation,
    getInputTokenValues,
    getOwner,
    getTokensRemainingForSale,
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
    <>
      <Grid container spacing={2}>
        <Grid item lg={3} md={0}></Grid>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          <Stack rowGap={2}>
            <HeroCard
              crowdsaleData={crowdsaleData}
              totalSupply={tokensRemainingForSale}
            />
            <StyledModal
              open={openPurchaseModal}
              handleClose={handleClosePurchaseModal}
              purchasePending={purchasePending}
            />

            {new BigNumber(crowdsaleEndTime).isGreaterThanOrEqualTo(
              Date.now() / 1000
            ) || new BigNumber(crowdsaleEndTime).isEqualTo(0) ? (
              <>
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
                              {parseFloat(selectedToken.userBalance).toFixed(
                                ROUND_OFF_DECIMALS_TO
                              )}{" "}
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
                          {Number(selectedToken.tokenRate).toFixed(
                            ROUND_OFF_DECIMALS_TO
                          )}{" "}
                          {crowdsaleData.token.symbol}
                        </CardText>
                        <CardSubHeading>for</CardSubHeading>
                        <CardSubHeading style={{ margin: "0 8px" }}>
                          1 {selectedToken.symbol}
                        </CardSubHeading>
                      </Stack>
                    )}

                    {account ? (
                      <LoadingButton
                        loading={pendingTxn}
                        variant={"contained"}
                        onClick={purchaseToken}
                      >
                        Swap for {crowdsaleData.token.symbol}
                      </LoadingButton>
                    ) : (
                      <Button
                        variant={"outlined"}
                        onClick={handleConnectWalletModalOpen}
                      >
                        Connect to Wallet
                      </Button>
                    )}
                  </Stack>
                </Card>
              </>
            ) : (
              <Card>
                <Stack>
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <CardSubHeading>Crowdsale has ended</CardSubHeading>
                  </Stack>
                </Stack>
              </Card>
            )}

            {account && (
              <Card>
                <Stack rowGap={3}>
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={1}
                  >
                    <CardSubHeading>Total tokens bought</CardSubHeading>
                    <Stack direction={"row"} alignItems={"center"} gap={1}>
                      <CardText>
                        {Number(userVestedAmount).toFixed(
                          ROUND_OFF_DECIMALS_TO
                        )}
                      </CardText>
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
      <Grid container spacing={2} marginTop={"20px"}>
        {ownerAddress === account && (
          <>
            <Stack
              flexWrap={"wrap"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              rowGap={1}
              columnGap={1}
            >
              <TransferFunds
                account={account}
                crowdsaleData={crowdsaleData}
                pendingTxn={pendingTxn}
                setPendingTxn={setPendingTxn}
                handleConnectWalletModalOpen={handleConnectWalletModalOpen}
              />
              <WithdrawFunds
                id={id}
                account={account}
                pendingTxn={pendingTxn}
                setPendingTxn={setPendingTxn}
                handleConnectWalletModalOpen={handleConnectWalletModalOpen}
              />
              <ChangeMaxCrowdsaleAllocation
                id={id}
                account={account}
                crowdsaleData={crowdsaleData}
                pendingTxn={pendingTxn}
                setPendingTxn={setPendingTxn}
                tokensRemaining={tokensRemainingForSale}
                handleConnectWalletModalOpen={handleConnectWalletModalOpen}
              />
              <ChangeMaxUserAllocation
                id={id}
                account={account}
                crowdsaleData={crowdsaleData}
                pendingTxn={pendingTxn}
                setPendingTxn={setPendingTxn}
                currMaxUserAllocation={currMaxUserAllocation}
                handleConnectWalletModalOpen={handleConnectWalletModalOpen}
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
                handleConnectWalletModalOpen={handleConnectWalletModalOpen}
              />
            </Stack>
            <Stack width={"100%"} alignItems={"center"} marginTop={"20px"}>
              <OwnerCard>
                <Button
                  variant={"contained"}
                  disabled={pendingTxn}
                  onClick={handleEndCrowdsale}
                >
                  End Crowdsale
                </Button>
              </OwnerCard>
            </Stack>
          </>
        )}
      </Grid>
    </>
  );
}

export default IVCOPage;
