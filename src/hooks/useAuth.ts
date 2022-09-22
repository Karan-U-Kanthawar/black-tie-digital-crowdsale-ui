import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { MAINNET_CHAINID } from "../config";
import setupNetwork from "../utils/setupNetwork";
import { connectorsByName } from "../components/ConnectWalletModal";
import { ConnectorNames } from "../components/ConnectWalletModal/connectors";

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID];
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork(MAINNET_CHAINID);
          if (hasSetup) {
            activate(connector);
          }
        } else {
          console.error(
            "Error while connecting to wallet: ",
            error.name,
            error.message
          );
        }
      });
    } else {
      console.error("Can't find connector", "The connector config is wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    login,
    logout: deactivate,
  };
};

export default useAuth;
