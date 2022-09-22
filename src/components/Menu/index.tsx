import React, { useEffect } from "react";
import { Button, Container, Stack } from "@mui/material";
import styled from "styled-components";
import { truncateAddress } from "../../hooks/useWeb3Config";
import CompanyLogo from "./companyLogo.svg";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import useAuth from "../../hooks/useAuth";
import { connectorLocalStorageKey } from "../ConnectWalletModal";
import { ConnectorNames } from "../ConnectWalletModal/connectors";

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

interface IMenu {
  handleConnectWalletModalOpen: () => void;
}

const Menu: React.FC<IMenu> = ({ handleConnectWalletModalOpen }) => {
  const { account } = useActiveWeb3React();
  const { logout, login } = useAuth();

  const deactivate = () => {
    logout();
    window.localStorage.removeItem(connectorLocalStorageKey);
  };

  useEffect(() => {
    if (account === null || account === undefined) {
      const connectorId = window.localStorage.getItem(
        connectorLocalStorageKey
      ) as ConnectorNames;

      if (connectorId && connectorId) {
        login(connectorId);
      }
    }
  }, [account, login]);

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
                <Button variant={"outlined"} onClick={deactivate}>
                  {`${truncateAddress(account)}`}
                </Button>
              </Stack>
            ) : (
              <Stack>
                <Button
                  variant={"contained"}
                  onClick={handleConnectWalletModalOpen}
                >
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
