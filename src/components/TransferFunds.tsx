import React, { useState } from "react";
import { Card, CardSubHeading, CardText } from "../styles/CardStyles";
import { Button, Stack, TextField } from "@mui/material";
import {
  BLACK_TIE_DIGITAL_PRESALE_ID,
  crowdsale,
  ROUND_OFF_DECIMALS_TO,
} from "../config";
import { InputContainer } from "../views/Presale/IVCOPage";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import erc20Abi from "../config/constants/abi/erc20.json";
import BigNumber from "bignumber.js";
import { Erc20 } from "../config/constants/abi/types";

const TransferFunds = ({
  account,
  crowdsaleData,
  pendingTxn,
  setPendingTxn,
  tokensRemaining,
  handleConnectWalletModalOpen,
}: {
  account: string;
  crowdsaleData: typeof crowdsale;
  pendingTxn: boolean;
  setPendingTxn: React.Dispatch<React.SetStateAction<boolean>>;
  tokensRemaining: string;
  handleConnectWalletModalOpen: () => void;
}) => {
  const [transferAmount, setTransferAmount] = useState("0");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransferAmount(event.target.value);
  };

  const handleTransfer = async () => {
    setPendingTxn(true);
    try {
      const provider = new ethers.providers.Web3Provider(
        // @ts-ignore
        (window as WindowChain).ethereum
      );
      const signer = provider.getSigner();
      const erc20Contract = (await new Contract(
        crowdsale.token.address,
        erc20Abi,
        signer
      )) as Erc20;

      const transferAmountInWei = new BigNumber(transferAmount)
        .multipliedBy(new BigNumber(10).pow(crowdsale.token.decimals))
        .toFixed();

      const txn = await erc20Contract.transfer(
        BLACK_TIE_DIGITAL_PRESALE_ID,
        transferAmountInWei
      );

      txn.wait();
      setPendingTxn(false);
    } catch (err) {
      setPendingTxn(false);
      console.error("Error while transferring funds: ", err);
    }
  };

  return (
    <>
      <Card>
        <Stack rowGap={3}>
          <CardText>Transfer funds ({crowdsale.token.symbol})</CardText>
          {account && (
            <>
              <Stack direction={"row"} justifyContent={"center"}>
                <CardSubHeading>Funds available: </CardSubHeading>
                <CardText style={{ margin: "0 8px" }}>
                  {Number(tokensRemaining).toFixed(ROUND_OFF_DECIMALS_TO)}{" "}
                  {crowdsaleData.token.symbol}
                </CardText>
              </Stack>
            </>
          )}
          <Stack>
            <InputContainer>
              <TextField
                label={"Transfer amount"}
                value={transferAmount}
                placeholder={"Amount to transfer"}
                variant={"outlined"}
                onChange={handleInputChange}
                size={"medium"}
                aria-placeholder={"0.0"}
                fullWidth
              />
            </InputContainer>
          </Stack>

          {account ? (
            <Button
              variant={"contained"}
              disabled={pendingTxn}
              onClick={handleTransfer}
            >
              Transfer funds
            </Button>
          ) : (
            <Button variant={"outlined"} onClick={handleConnectWalletModalOpen}>
              Connect to Wallet
            </Button>
          )}
        </Stack>
      </Card>
      <div></div>
    </>
  );
};

export default TransferFunds;
