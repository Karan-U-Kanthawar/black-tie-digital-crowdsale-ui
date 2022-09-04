import React, { useState } from "react";
import { Card, CardSubHeading, CardText } from "../styles/CardStyles";
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
import { allowedInputTokens, crowdsale } from "../config";
import { InputContainer } from "../views/Presale/IVCOPage";
import useWeb3Config from "../hooks/useWeb3Config";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import crowdsaleAbi from "../config/constants/abi/crowdsale.json";

const ChangeInputTokenRate = ({
  account,
  crowdsaleData,
  selectedToken,
  showSelectedToken,
  handleShowSelectedToken,
  allowedInputTokensWithRateAndBalance,
  pendingTxn,
  setPendingTxn,
  id,
}: {
  id: string;
  account: string;
  crowdsaleData: typeof crowdsale;
  selectedToken: typeof allowedInputTokens[0];
  showSelectedToken: string;
  handleShowSelectedToken: (event: SelectChangeEvent) => void;
  allowedInputTokensWithRateAndBalance: typeof allowedInputTokens;
  pendingTxn: boolean;
  setPendingTxn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newInputTokenRate, setNewInputTokenRate] = useState("0");
  const { connectWallet } = useWeb3Config();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewInputTokenRate(event.target.value);
  };

  const handleUpdateInputTokenRate = async () => {
    setPendingTxn(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crowdSaleContract = await new Contract(id, crowdsaleAbi, signer);

      const inputTokenAmountInWei = ethers.utils.parseUnits(
        newInputTokenRate.toString(),
        selectedToken.decimals
      );

      await crowdSaleContract.updateInputTokenRate(
        selectedToken.address,
        inputTokenAmountInWei
      );

      setPendingTxn(false);
    } catch (err) {
      setPendingTxn(false);
      console.error("Error while updating the input token rate: ", err);
    }
  };

  return (
    <>
      <Card>
        <Stack rowGap={3}>
          <CardText>Change Input Token Rate</CardText>
          {account && (
            <>
              <Stack direction={"row"} justifyContent={"center"}>
                <CardSubHeading>Current token rate: </CardSubHeading>
                <CardText style={{ margin: "0 8px" }}>
                  {selectedToken.tokenRate} {crowdsaleData.token.symbol}
                </CardText>
                <CardSubHeading>for</CardSubHeading>
                <CardSubHeading style={{ margin: "0 8px" }}>
                  1 {selectedToken.symbol}
                </CardSubHeading>
              </Stack>
              <Stack direction={"row"} justifyContent={"center"}>
                <CardSubHeading>New token rate: </CardSubHeading>
                <CardText style={{ margin: "0 8px" }}>
                  {newInputTokenRate} {crowdsaleData.token.symbol}
                </CardText>
                <CardSubHeading>for</CardSubHeading>
                <CardSubHeading style={{ margin: "0 8px" }}>
                  1 {selectedToken.symbol}
                </CardSubHeading>
              </Stack>
            </>
          )}
          <Stack>
            <InputContainer>
              <TextField
                label={"New Input token rate"}
                value={newInputTokenRate}
                placeholder={"Input token rate"}
                variant={"outlined"}
                onChange={handleInputChange}
                size={"medium"}
                aria-placeholder={"0.0"}
                fullWidth
              />
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
                {allowedInputTokensWithRateAndBalance.map((inputToken) => (
                  <MenuItem value={inputToken.symbol} key={inputToken.address}>
                    {inputToken.symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          }

          {account ? (
            <Button
              variant={"contained"}
              disabled={pendingTxn}
              onClick={handleUpdateInputTokenRate}
            >
              Update token rate for {selectedToken.symbol}
            </Button>
          ) : (
            <Button variant={"outlined"} onClick={connectWallet}>
              Connect to Wallet
            </Button>
          )}
        </Stack>
      </Card>
      <div></div>
    </>
  );
};

export default ChangeInputTokenRate;