import { FC } from "react";
import { Card } from "../styles/CardStyles";
import { Modal } from "@mui/material";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import Tick from "./Tick";
import Error from "./Error";

interface IStyledModal {
  open: boolean;
  handleClose: () => void;
  purchasePending: {
    loading: boolean;
    success: boolean;
    failure: boolean;
  };
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "250px",
};

export const OvalContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledModal: FC<IStyledModal> = ({
  open,
  handleClose,
  purchasePending,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Card
          sx={style}
          style={{ maxWidth: "500px", justifyContent: "space-between" }}
        >
          {purchasePending.loading && (
            <OvalContainer>
              <Oval
                height={150}
                width={150}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </OvalContainer>
          )}
          {purchasePending.success && <Tick />}
          {purchasePending.failure && (
            <OvalContainer>
              <Error width={150} />
            </OvalContainer>
          )}
        </Card>
      </>
    </Modal>
  );
};

export default StyledModal;
