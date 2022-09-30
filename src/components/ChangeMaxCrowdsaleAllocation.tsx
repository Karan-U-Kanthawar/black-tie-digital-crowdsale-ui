import React, { useState } from "react";
import { CardSubHeading, CardText } from "../styles/CardStyles";
import { Button, Stack, TextField } from "@mui/material";
import { crowdsale, ROUND_OFF_DECIMALS_TO } from "../config";
import { InputContainer, OwnerCard } from "../views/Presale/IVCOPage";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import crowdsaleAbi from "../config/constants/abi/crowdsale.json";
import BigNumber from "bignumber.js";

const ChangeMaxCrowdsaleAllocation = ({
  id,
  account,
  crowdsaleData,
  pendingTxn,
  setPendingTxn,
  tokensRemaining,
  handleConnectWalletModalOpen,
}: {
  id: string;
  account: string;
  crowdsaleData: typeof crowdsale;
  pendingTxn: boolean;
  setPendingTxn: React.Dispatch<React.SetStateAction<boolean>>;
  tokensRemaining: string;
  handleConnectWalletModalOpen: () => void;
}) => {
  const [newCrowdsaleAllocation, setNewCrowdsaleAllocation] = useState("0");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCrowdsaleAllocation(event.target.value);
  };

  const handleUpdateMaxCrowdsaleAllocation = async () => {
    setPendingTxn(true);
    try {
      const provider = new ethers.providers.Web3Provider(
        // @ts-ignore
        (window as WindowChain).ethereum
      );
      const signer = provider.getSigner();
      const crowdSaleContract = await new Contract(id, crowdsaleAbi, signer);

      const newCrowdsaleAllocationInWei = new BigNumber(newCrowdsaleAllocation)
        .multipliedBy(new BigNumber(10).pow(crowdsale.token.decimals))
        .toFixed();

      const txn = await crowdSaleContract.updateMaxCrowdsaleAllocation(
        newCrowdsaleAllocationInWei
      );

      txn.wait();
      setPendingTxn(false);
    } catch (err) {
      setPendingTxn(false);
      console.error(
        "Error while updating the maximum crowdsale allocation: ",
        err
      );
    }
  };

  return (
    <OwnerCard>
      <Stack rowGap={3}>
        <CardText>Change Max Crowdsale Allocation</CardText>
        {account && (
          <>
            <Stack direction={"row"} justifyContent={"center"}>
              <CardSubHeading>Current allocation: </CardSubHeading>
              <CardText style={{ margin: "0 8px" }}>
                {Number(tokensRemaining).toFixed(ROUND_OFF_DECIMALS_TO)}{" "}
                {crowdsaleData.token.symbol}
              </CardText>
            </Stack>
            <Stack direction={"row"} justifyContent={"center"}>
              <CardSubHeading>New allocation: </CardSubHeading>
              <CardText style={{ margin: "0 8px" }}>
                {newCrowdsaleAllocation} {crowdsaleData.token.symbol}
              </CardText>
            </Stack>
          </>
        )}
        <Stack>
          <InputContainer>
            <TextField
              label={"New max crowdsale allocation"}
              value={newCrowdsaleAllocation}
              placeholder={"Max crowdsale allocation"}
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
            onClick={handleUpdateMaxCrowdsaleAllocation}
          >
            Update max crowdsale allocation
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

export default ChangeMaxCrowdsaleAllocation;
