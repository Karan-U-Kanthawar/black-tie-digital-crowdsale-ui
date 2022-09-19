import React, { useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./routerHistory";
import Presale from "./views/Presale";
import useWeb3Config from "./hooks/useWeb3Config";
import Menu from "./components/Menu";
import { MAINNET_CHAINID } from './config/index';
import getNodeUrl from './utils/getRpcUrl';

function App() {
  useWeb3Config();
  useEffect(() => {
    const checkNetwrok = async () => {
      if (window && window.ethereum && window.ethereum.networkVersion) {
        if (window.ethereum.networkVersion !== MAINNET_CHAINID) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: `0x${MAINNET_CHAINID.toString(16)}` }],
            });
            return true;
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              const rpcUrl = getNodeUrl(MAINNET_CHAINID)
              // @ts-ignore
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${MAINNET_CHAINID.toString(16)}`,
                    chainName: "MATIC Mainnet",
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    // @ts-ignore
                    rpcUrls: rpcUrl,
                    blockExplorerUrls: ["https://polygonscan.io/"],
                  },
                ],
              });
            }
            return false;
          }
        }
      }
    }
    checkNetwrok()
  }, [])

  return (
    <Router history={history}>
      <Menu />
      <Switch>
        <Route path="/" exact>
          <Presale />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
