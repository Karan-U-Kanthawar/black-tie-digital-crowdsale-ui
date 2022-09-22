import { FC } from "react";
import { Card, CardHeading, CardText } from "../../styles/CardStyles";
import { Button, Modal, Stack } from "@mui/material";
import {
  Config,
  connectorLocalStorageKey,
  Connectors,
  Login,
} from "./connectors";

interface IStyledModal {
  open: boolean;
  handleClose: () => void;
  login: Login;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "250px",
};

interface Props {
  walletConfig: Config;
  login: Login;
  onDismiss: () => void;
}

const WalletCard: FC<Props> = ({ login, walletConfig, onDismiss }) => {
  const { title, icon: Icon } = walletConfig;
  return (
    <Button
      variant="contained"
      onClick={() => {
        login(walletConfig.connectorId);
        window.localStorage.setItem(
          connectorLocalStorageKey,
          walletConfig.connectorId
        );
        onDismiss();
      }}
      fullWidth
      style={{ marginBottom: "10px" }}
    >
      <Stack
        width={"100%"}
        flexDirection={"row"}
        padding={"0px 5px"}
        justifyContent={"space-between"}
      >
        <CardText style={{ marginRight: "16px" }}>{title}</CardText>
        <Icon width="32px" />
      </Stack>
    </Button>
  );
};

const ConnectWalletModal: FC<IStyledModal> = ({ open, handleClose, login }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="Connect Wallet"
      aria-describedby="Modal to connect wallet to use the app. Eg: Metamask, WalletConnect"
    >
      <Card
        sx={style}
        style={{ maxWidth: "500px", justifyContent: "space-around" }}
      >
        <CardHeading>Connect Wallet</CardHeading>
        <Stack flexDirection={"column"}>
          {Connectors.map((connector) => (
            <div style={{ width: "100%" }} key={connector.connectorId}>
              <WalletCard
                walletConfig={connector}
                login={login}
                onDismiss={handleClose}
              />
            </div>
          ))}
        </Stack>
      </Card>
    </Modal>
  );
};

export default ConnectWalletModal;
export { connectorsByName } from "./connectors";
export { connectorLocalStorageKey } from "./connectors";
export { Connectors } from "./connectors";
