import React, { useContext } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';

import { BaseBtn } from '../../common';
import { abbreviateAddress } from '../../../utils';
import { SuccessLayer } from './SuccessLayer';

const HeaderWrapper = styled.div`
  display: flex;
  postion: relative;
  height: 10%;
  align-content: center;
  margin-bottom: 40px;
`;

const Header = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: ${p => p.theme.colors.dark}
  text-align: center;
  width: 100%;
`;

const AmountContainer = styled.label`
  display: block;
  position: relative;
  font-weight: bold;
`;

const Currency = styled.span`
  position: absolute;
  z-index: 1;
  top: 50%;
  font-weight: bold;
  cursor: text;
  pointer-events: none;
  margin-left: 20px;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.dark};
`;

const AmountInput = styled.input`
  display: flex;
  font-weight: bold;
  font-size: 4rem;
  width: 100%;
  text-align: center;
  outline: none;
  border: none;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.dark};

  ::placeholder {
    color: ${p => p.theme.colors.dark};
  }
`;
const AmountSublabel = styled.label`
  color: ${p => p.theme.colors.dark};
  font-size: 1.4rem;
  text-align: center;
`;

const DoneBtn = styled(BaseBtn)`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.lumerin.hypertext - gray : theme.colors.primary};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const FooterLabel = styled.label`
  color: ${p => p.theme.colors.dark};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

// export function ConfirmForm({ activeTab, address, lmrBalanceUSD, sendLmrDisabled, sendLmrDisabledReason, onTabSwitch, amountInput, onAmountInput, destinationAddress, onDestinationAddressInput, onInputChange, usdAmount, coinAmount, onMaxClick }) {
export function SuccessForm(props) {
  const context = useContext(ToastsContext);

  const handleTabSwitch = e => {
    e.preventDefault();

    props.onTabSwitch(e.target.dataset.modal);
  };

  const handleDestinationAddressInput = e => {
    e.preventDefault();

    props.onDestinationAddressInput(e.target.value);
  };

  const handleAmountInput = e => {
    e.preventDefault();

    props.onAmountInput(e.target.value);
    props.onInputChange(e);
  };

  if (!props.activeTab) {
    return <></>;
  }

  const convertToLMR = val => {
    return val * 15.8;
  };

  return (
    <>
      <Column>
        <HeaderWrapper>
          <Header>Success</Header>
        </HeaderWrapper>

        <SuccessLayer />
      </Column>

      <Column>
        <AmountContainer>
          <Currency isActive={props.amountInput > 0}>$</Currency>
          <AmountInput
            id="usdAmount"
            placeholder={0}
            isActive={props.amountInput > 0}
            onChange={handleAmountInput}
            value={props.amountInput}
          />
        </AmountContainer>
        <AmountSublabel>
          {convertToLMR(props.amountInput) || 0} LMR
        </AmountSublabel>
      </Column>

      <Footer>
        <FooterLabel>
          You have successfully transferred LMR to {props.destinationAddress}
        </FooterLabel>
        <DoneBtn data-modal={null} onClick={handleTabSwitch}>
          Done
        </DoneBtn>
      </Footer>
    </>
  );
}
