import React, { useState } from "react";
import { CardSubHeading, CardText } from "../styles/CardStyles";
import { Button, Stack, TextField } from "@mui/material";
import { crowdsale, ROUND_OFF_DECIMALS_TO } from "../config";
import { InputContainer, OwnerCard } from "../views/Presale/IVCOPage";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import crowdsaleAbi from "../config/constants/abi/crowdsale.json";
import BigNumber from "bignumber.js";

const ChangeMaxUserAllocation = ({
  id,
  account,
  crowdsaleData,
  pendingTxn,
  setPendingTxn,
  currMaxUserAllocation,
  handleConnectWalletModalOpen,
}: {
  id: string;
  account: string;
  crowdsaleData: typeof crowdsale;
  pendingTxn: boolean;
  setPendingTxn: React.Dispatch<React.SetStateAction<boolean>>;
  currMaxUserAllocation: string;
  handleConnectWalletModalOpen: () => void;
}) => {
  const [newMaxUserAllocation, setNewMaxUserAllocation] = useState("0");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMaxUserAllocation(event.target.value);
  };

  const handleUpdateMaxUserAllocation = async () => {
    setPendingTxn(true);
    try {
      const provider = new ethers.providers.Web3Provider(
        // @ts-ignore
        (window as WindowChain).ethereum
      );
      const signer = provider.getSigner();
      const crowdSaleContract = await new Contract(id, crowdsaleAbi, signer);

      const newMaxUserAllocationInWei = new BigNumber(newMaxUserAllocation)
        .multipliedBy(new BigNumber(10).pow(crowdsale.token.decimals))
        .toFixed();

      const txn = await crowdSaleContract.updateMaxUserAllocation(
        newMaxUserAllocationInWei
      );

      txn.wait();
      setPendingTxn(false);
    } catch (err) {
      setPendingTxn(false);
      console.error("Error while updating the maximum user allocation: ", err);
    }
  };

  return (
    <OwnerCard>
      <Stack rowGap={3}>
        <CardText>Change Max User Allocation</CardText>
        {account && (
          <>
            <Stack direction={"row"} justifyContent={"center"}>
              <CardSubHeading>Current user allocation: </CardSubHeading>
              <CardText style={{ margin: "0 8px" }}>
                {Number(currMaxUserAllocation).toFixed(ROUND_OFF_DECIMALS_TO)}{" "}
                {crowdsaleData.token.symbol}
              </CardText>
            </Stack>
            <Stack direction={"row"} justifyContent={"center"}>
              <CardSubHeading>New user allocation: </CardSubHeading>
              <CardText style={{ margin: "0 8px" }}>
                {newMaxUserAllocation} {crowdsaleData.token.symbol}
              </CardText>
            </Stack>
          </>
        )}
        <Stack>
          <InputContainer>
            <TextField
              label={"New max user allocation"}
              value={newMaxUserAllocation}
              placeholder={"Max user allocation"}
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
            onClick={handleUpdateMaxUserAllocation}
          >
            Update max user allocation
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

export default ChangeMaxUserAllocation;
