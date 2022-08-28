/* eslint-disable import/no-anonymous-default-export */
import { InjectedConnector } from "@web3-react/injected-connector";
import { SUPPORTED_NETWORK_IDS } from "../config";

export default function () {
  const injected = new InjectedConnector({
    supportedChainIds: SUPPORTED_NETWORK_IDS,
  });

  return {
    injected,
  };
}
