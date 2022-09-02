import React from "react";
import { CustomWeb3Provider } from "./components/Menu/useWeb3Config";

const Providers: React.FC = ({ children }) => {
  return <CustomWeb3Provider>{children}</CustomWeb3Provider>;
};

export default Providers;
