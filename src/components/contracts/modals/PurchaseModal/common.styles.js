import styled from 'styled-components';
import { Label } from '../CreateContractModal.styles';

export const Divider = styled.div`
margin-top: 5px
width:100%;
height: 0px;
border: 0.5px solid rgba(0, 0, 0, 0.25);`;

export const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OrderSummary = styled(Label)`
  display: flex;
  align-items: center;
  font-size: 1rem !important;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
`;
export const ProxyRouterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const Values = styled.div`
  line-height: 1.4rem;
  font-size: 1.4rem;
  font-weight: 100;
  display: flex;
  align-items: center;
`;

export const EditBtn = styled.div`
  cursor: pointer;
  color: #014353;
  text-decoration: underline;
  font-size: 1rem;
  letter-spacing: 1px;
`;

export const PreviewCont = styled.div`
  display: flex;
  height: 85%;
  margin: 1rem 0 0;
  flex-direction: column;
  justify-content: space-between;
`;
