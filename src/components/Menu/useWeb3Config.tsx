import { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

const providerOptions = {
  injected: {
    display: {
      name: "Injected",
      description: "Connect with the provider in your Browser",
    },
    package: null,
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

const useWeb3Config = () => {
  const [provider, setProvider] = useState<null | any>(null);
  const [library, setLibrary] = useState<null | Web3Provider>(null);
  const [account, setAccount] = useState<null | string>(null);
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState<null | number>(null);
  const [network, setNetwork] = useState<null | number>(null);

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    setAccount(null);
    setChainId(null);
    setNetwork(null);
  };

  const disconnect = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  }, []);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId: number) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [disconnect, error, provider]);

  return { account, chainId, library, network, connectWallet };
};

export default useWeb3Config;
