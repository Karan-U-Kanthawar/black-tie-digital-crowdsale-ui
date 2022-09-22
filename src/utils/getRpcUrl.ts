import { MAINNET_CHAINID } from "../config";

export const nodes = {
  "80001": "https://matic-mumbai.chainstacklabs.com",
  "5": "https://goerli.infura.io/v3/",
  "137": "https://polygon-rpc.com",
  "1": "https://eth-mainnet.public.blastapi.io",
  "56": "https://bsc-dataseed.binance.org",
  "1287": "https://rpc.api.moonbase.moonbeam.network",
};

const getNodeUrl = (chainId?: number) => {
  let id = chainId ?? MAINNET_CHAINID;
  if (!chainId && window && (window as WindowChain).ethereum) {
    id = Number(
      (window as WindowChain).ethereum?.networkVersion ?? MAINNET_CHAINID
    );
  }
  return nodes[id.toString() as keyof typeof nodes];
};

export default getNodeUrl;
