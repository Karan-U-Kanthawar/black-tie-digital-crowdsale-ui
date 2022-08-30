import { useMemo } from "react";
import { getCrowdsaleContract } from "../utils/contractHelpers";
import useWeb3Config from "../components/Menu/useWeb3Config";

export const useCrowdsaleContract = (address: string) => {
  const { library } = useWeb3Config();

  return useMemo(
    () => getCrowdsaleContract(address, library?.getSigner()),
    [address, library]
  );
};
