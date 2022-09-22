import React from "react";
import { CustomWeb3Provider } from "./hooks/useWeb3Config";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export const getLibrary = (provider: any): Web3Provider => {
  console.log("provider: ", provider);
  return provider;
};
const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK");

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <CustomWeb3Provider>{children}</CustomWeb3Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default Providers;
