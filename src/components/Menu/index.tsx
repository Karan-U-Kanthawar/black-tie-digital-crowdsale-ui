import React from "react";
import { Button, Chip, Container, Stack } from "@mui/material";
import styled from "styled-components";
import useWeb3Config, { truncateAddress } from "./useWeb3Config";
import CompanyLogo from "./companyLogo.svg";

const BlackContainer = styled.div`
  background-color: ${(props) => props.theme.palette.background.default};
  padding-top: 20px;
`;

const StyledContainer = styled(Container)``;
const NavigationContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    justify-content: space-evenly;
  }
`;

const LogoContainer = styled.div``;

const Menu: React.FC = () => {
  const { account, connectWallet, disconnect } = useWeb3Config();

  return (
    <BlackContainer>
      <StyledContainer>
        <NavigationContainer>
          <LogoContainer>
            <img src={CompanyLogo} width={"250px"} alt={"B4Real"} />
          </LogoContainer>

          <Stack justifyContent={"center"}>
            {account ? (
              <Stack direction={"row"} spacing={2}>
                <Chip label={`Account : ${truncateAddress(account)}`}></Chip>
                <Button onClick={disconnect}>Disconnect</Button>
              </Stack>
            ) : (
              <Stack>
                <Button variant={"contained"} onClick={connectWallet}>
                  Connect to wallet
                </Button>
              </Stack>
            )}
          </Stack>
        </NavigationContainer>
      </StyledContainer>
    </BlackContainer>
  );
};

export default Menu;
