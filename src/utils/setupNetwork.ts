import { NATIVE_TOKENS } from "../config";
import { nodes } from "./getRpcUrl";

const setupNetwork = async (chainId: number) => {
  const provider = (window as WindowChain).ethereum;
  if (provider) {
    // @ts-ignore
    let chainIdFallback = parseInt(chainId, 10);
    try {
      // @ts-ignore
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainIdFallback.toString(16)}`,
            chainName: "Matic",
            nativeCurrency: {
              name: NATIVE_TOKENS[chainIdFallback as keyof typeof NATIVE_TOKENS]
                .name,
              symbol:
                NATIVE_TOKENS[chainIdFallback as keyof typeof NATIVE_TOKENS]
                  .symbol,
              decimals:
                NATIVE_TOKENS[chainIdFallback as keyof typeof NATIVE_TOKENS]
                  .decimals,
            },
            rpcUrls: nodes[chainIdFallback.toString() as keyof typeof nodes],
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

export default setupNetwork;
