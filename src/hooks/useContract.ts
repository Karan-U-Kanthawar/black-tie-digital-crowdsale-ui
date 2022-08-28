import { useMemo } from "react";
import useWeb3 from "./useWeb3";
import {
  getCrowdsaleContract,
  getERC20Contract,
} from "../utils/contractHelpers";

export const useERC20 = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getERC20Contract(address, web3), [address, web3]);
};

export const useCrowdsaleContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getCrowdsaleContract(address, web3), [address, web3]);
};
