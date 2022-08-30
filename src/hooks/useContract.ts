import { useMemo } from "react";
import { getCrowdsaleContract } from "../utils/contractHelpers";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";

export const useCrowdsaleContract = (
  address: string,
  library?: Web3Provider | StaticJsonRpcProvider
) => {
  return useMemo(
    () => getCrowdsaleContract(address, library?.getSigner()),
    [address, library]
  );
};
