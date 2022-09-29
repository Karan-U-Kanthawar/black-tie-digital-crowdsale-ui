import React, { useState } from "react";
import { CardSubHeading, CardText } from "../styles/CardStyles";
import { Button, Stack, TextField } from "@mui/material";
import { crowdsale, ROUND_OFF_DECIMALS_TO } from "../config";
import { InputContainer, OwnerCard } from "../views/Presale/IVCOPage";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import crowdsaleAbi from "../config/constants/abi/crowdsale.json";
import BigNumber from "bignumber.js";

const WithdrawFunds = ({
  id,
  account,
  pendingTxn,
  setPendingTxn,
  handleConnectWalletModalOpen,
  crowdsaleData,
  tokensRemaining,
}: {
  id: string;
  account: string;
  pendingTxn: boolean;
  setPendingTxn: React.Dispatch<React.SetStateAction<boolean>>;
  handleConnectWalletModalOpen: () => void;
  crowdsaleData: typeof crowdsale;
  tokensRemaining: string;
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState("0");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(event.target.value);
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
        .multipliedBy(new BigNumber(10).pow(crowdsale.token.decimals))
        .toFixed();

      const txn = await crowdSaleContract.withdrawFunds(
        crowdsale.token.address,
        withdrawAmountInWei
      );

      txn.wait();
      setPendingTxn(false);
    } catch (err) {
      setPendingTxn(false);
      console.error("Error while withdrawing funds: ", err);
    }
  };

  return (
    <OwnerCard>
      <Stack rowGap={3}>
        <CardText>Withdraw funds ({crowdsale.token.symbol})</CardText>
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
              label={"Withdraw amount"}
              value={withdrawAmount}
              placeholder={"Amount to withdraw"}
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
            onClick={handleWithdraw}
          >
            Withdraw funds
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
