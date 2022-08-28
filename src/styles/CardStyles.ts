import styled from "styled-components";
import { Paper } from "@mui/material";

export const Card = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
export const CardBody = styled.div``;
export const Hr = styled.div`
  background: ${(props) => props.theme.palette.primary.main};
  border-radius: 1px;
  transform: matrix(1, 0, 0, -1, 0, 0);
  width: 100%;
  height: 2px;
  margin: 10px 0 20px 0;
`;
export const CardHeading = styled.h2`
  font-family: Anton, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  text-align: left;
  font-size: 28px;
  letter-spacing: 1.2px;
`;
export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
export const CardSubHeading = styled.p`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.palette.text.disabled};
`;
export const CardText = styled.p`
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.palette.text.secondary};
`;
