import { StaticJsonRpcProvider } from "@ethersproject/providers";
import getRpcUrl from "./getRpcUrl";

const RPC_URL = getRpcUrl();

const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL);

export default simpleRpcProvider;
