import Web3 from "web3";
import getConnectors from "./web3Connectors";
import { ConnectorNames } from "./connectorNames";

const connectors = getConnectors();

export const connectorsByName: any = {
  [ConnectorNames.Injected]: connectors.injected,
};

export const getLibrary = (provider: any): Web3 => {
  return provider;
};
