import React, { useCallback, useEffect, useState } from "react";
import { CardSubHeading, CardText } from "../styles/CardStyles";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import {
  allowedInputTokens,
  BLACK_TIE_DIGITAL_PRESALE_ID,
  crowdsale,
  ROUND_OFF_DECIMALS_TO,
} from "../config";
import { InputContainer, OwnerCard } from "../views/Presale/IVCOPage";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import crowdsaleAbi from "../config/constants/abi/crowdsale.json";
import BigNumber from "bignumber.js";
import { getERC20Contract } from "../utils/contractHelpers";

let crowdsaleToken = [
  {
    symbol: crowdsale.token.symbol,
    address: crowdsale.token.address,
    decimals: crowdsale.token.decimals,
    userBalance: "0",
  },
];
const inputTokens = allowedInputTokens.map((tokens) => {
  return {
    symbol: tokens.symbol,
    address: tokens.address,
    decimals: tokens.decimals,
    userBalance: tokens.userBalance,
  };
});
const withdrawTokens = crowdsaleToken.concat(inputTokens);

const WithdrawFunds = ({
  id,
  account,
  pendingTxn,
  setPendingTxn,
  handleConnectWalletModalOpen,
}: {
  id: string;
  account: string;
  pendingTxn: boolean;
  setPendingTxn: React.Dispatch<React.SetStateAction<boolean>>;
  handleConnectWalletModalOpen: () => void;
}) => {
  const [withdrawTokensWithBalances, setWithdrawTokensWithBalances] =
    useState(withdrawTokens);
  const [selectedWithdrawToken, setSelectedWithdrawToken] = useState(
    withdrawTokensWithBalances[0]
  );

  useEffect(() => {
    setSelectedWithdrawToken(() => withdrawTokensWithBalances[0]);
  }, [withdrawTokensWithBalances]);

  const [showSelectedWithdrawToken, setShowSelectedWithdrawToken] = useState(
    selectedWithdrawToken.symbol
  );

  useEffect(() => {
    setShowSelectedWithdrawToken(() => selectedWithdrawToken.symbol);
  }, [selectedWithdrawToken.symbol]);

  const [withdrawAmount, setWithdrawAmount] = useState("0");

  const getWithdrawTokenValues = useCallback(async () => {
    Promise.all(
      withdrawTokens.map(async (withdrawToken) => {
        const erc20Contract = getERC20Contract(withdrawToken.address);
        const balance = await erc20Contract.balanceOf(
          BLACK_TIE_DIGITAL_PRESALE_ID
        );
        return new BigNumber(balance.toString())
          .dividedBy(new BigNumber(10).pow(withdrawToken.decimals))
          .toFixed();
      })
    )
      .then((balances) => {
        const prevData = withdrawTokensWithBalances;
        prevData.forEach((element, index) => {
          element.userBalance = balances[index];
        });

        setWithdrawTokensWithBalances(() => prevData);
      })
      .catch((err) =>
        console.error("Error in Promise.all of getWithdrawTokenValues: ", err)
      );
  }, [withdrawTokensWithBalances]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(event.target.value);
  };

  const handleShowSelectedToken = (event: SelectChangeEvent) => {
    const selectedInputToken = withdrawTokens.filter(
      (inputTokens) => inputTokens.symbol === event.target.value
    );
    setShowSelectedWithdrawToken(selectedInputToken[0].symbol);
    setSelectedWithdrawToken(selectedInputToken[0]);
  };

  const handleWithdraw = async () => {
    setPendingTxn(true);
    try {
      const provider = new ethers.providers.Web3Provider(
        // @ts-ignore
        (window as WindowChain).ethereum
      );
      const signer = provider.getSigner();
      const crowdSaleContract = await new Contract(id, crowdsaleAbi, signer);

      const withdrawAmountInWei = new BigNumber(withdrawAmount)
        .multipliedBy(new BigNumber(10).pow(selectedWithdrawToken.decimals))
        .toFixed();

      const txn = await crowdSaleContract.withdrawFunds(
        selectedWithdrawToken.address,
        withdrawAmountInWei
      );

      txn.wait();
      setPendingTxn(false);
    } catch (err) {
      setPendingTxn(false);
      console.error("Error while withdrawing funds: ", err);
    }
  };

  const handleMaxClick = () => {
    setWithdrawAmount(selectedWithdrawToken.userBalance);
  };

  useEffect(() => {
    getWithdrawTokenValues().catch((e) =>
      console.log("Error in getWithdrawTokenValues: ", e)
    );
  }, [getWithdrawTokenValues]);

  return (
    <OwnerCard>
      <Stack rowGap={3}>
        <CardText>Withdraw funds</CardText>
        {account && (
          <>
            <Stack direction={"row"} justifyContent={"center"}>
              <CardSubHeading>Funds available: </CardSubHeading>
              <CardText style={{ margin: "0 8px" }}>
                {Number(selectedWithdrawToken.userBalance).toFixed(
                  ROUND_OFF_DECIMALS_TO
                )}{" "}
                {selectedWithdrawToken.symbol}
              </CardText>
            </Stack>
          </>
        )}
        <Stack>
          <InputContainer>
            <TextField
              label={`${selectedWithdrawToken.symbol} amount`}
              value={withdrawAmount}
              placeholder={"Amount to withdraw"}
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

        <FormControl>
          <InputLabel id={"select-input-token-label"}>Input token</InputLabel>
          <Select
            labelId="select-input-token-label"
            id="select-input-token"
            value={showSelectedWithdrawToken}
            onChange={handleShowSelectedToken}
            label="Input token"
          >
            {withdrawTokens.map((inputToken) => (
              <MenuItem value={inputToken.symbol} key={inputToken.address}>
                {inputToken.symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {account ? (
          <Button
            variant={"contained"}
            disabled={pendingTxn}
            onClick={handleWithdraw}
          >
            Withdraw {selectedWithdrawToken.symbol}
          </Button>
        ) : (
          <Button variant={"outlined"} onClick={handleConnectWalletModalOpen}>
            Connect to Wallet
          </Button>
        )}
      </Stack>
    </OwnerCard>
  );
};

export default WithdrawFunds;
