import Metamask from "../../config/walletIcons/Metamask";
import WalletConnect from "../../config/walletIcons/WalletConnect";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import getNodeUrl from "../../utils/getRpcUrl";
import { MAINNET_CHAINID, SUPPORTED_NETWORK_IDS } from "../../config";
import { FC } from "react";
import { SvgProps } from "../../config/walletIcons/types";

// types
export enum ConnectorNames {
  Injected = "injected",
  WalletConnect = "walletconnect",
}
export type Login = (connectorId: ConnectorNames) => void;
export interface Config {
  title: string;
  type: string;
  icon: FC<SvgProps>;
  connectorId: ConnectorNames;
}

export const Connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    type: "web3",
    connectorId: ConnectorNames.Injected,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    type: "web3",
    connectorId: ConnectorNames.WalletConnect,
  },
];

export const connectorLocalStorageKey = "connectorId";

const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_NETWORK_IDS,
});
const walletConnectConnector = new WalletConnectConnector({
  rpc: { [SUPPORTED_NETWORK_IDS[0]]: getNodeUrl(MAINNET_CHAINID) },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletConnectConnector,
};
