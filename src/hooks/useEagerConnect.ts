import {useEffect} from "react";
import useAuth from "./useAuth";
import {ConnectorNames} from "../utils/connectorNames";

const connectorLocalStorageKey = "connectorId";

const useEagerConnect = () => {
  const { login } = useAuth();
  const { location } = window;
  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      connectorLocalStorageKey
    ) as ConnectorNames;

    // Disable eager connect for BSC Wallet. Currently the BSC Wallet extension does not inject BinanceChain
    // into the Window object in time causing it to throw an error
    // TODO: Figure out an elegant way to listen for when the BinanceChain object is ready
    if (connectorId && connectorId) {
      login(connectorId);
    }
  }, [login, location]);
};

export default useEagerConnect;
