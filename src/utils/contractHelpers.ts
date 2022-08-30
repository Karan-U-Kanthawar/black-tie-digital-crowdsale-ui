import erc20Abi from "../config/constants/abi/erc20.json";
import crowdsaleAbi from "../config/constants/abi/crowdsale.json";
import simpleRpcProvider from "./defaultProvider";
import type { Signer } from "@ethersproject/abstract-signer";
import type { Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { Crowdsale, Erc20 } from "../config/constants/abi/types";

export const getContract = (
  abi: any,
  address: string,
  signer?: Signer | Provider
) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new Contract(address, abi, signerOrProvider);
};

export const getERC20Contract = (
  address: string,
  signer?: Signer | Provider
) => {
  return getContract(erc20Abi, address, signer) as Erc20;
};

export const getCrowdsaleContract = (
  address: string,
  signer?: Signer | Provider
) => {
  return getContract(crowdsaleAbi, address, signer) as Crowdsale;
};
