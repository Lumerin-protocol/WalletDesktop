import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';

import BackIcon from '../../icons/BackIcon';
import { BaseBtn } from '../../common';
import { abbreviateAddress } from '../../../utils';

const HeaderWrapper = styled.div`
  display: flex;
  postion: relative;
  height: 10%;
  align-content: center;
`;

const Header = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: ${p => p.theme.colors.dark}
  text-align: center;
  width: 100%;
`;

const BackBtn = styled(BaseBtn)`
  position: absolute;
  color: ${p => p.theme.colors.dark};
  font-weight: bold;
  margin: 8px 0 0 5px;
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

const FeeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const FeeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const FeeLabel = styled.div`
  font-size: 1.4rem;
  color: ${p => p.theme.colors.dark};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
const WalletContainer = styled.label`
  display: block;
  position: relative;
`;
const WalletInputLabel = styled.span`
  position: absolute;
  z-index: 1;
  top: 50%;
  font-weight: bold;
  cursor: text;
  pointer-events: none;
  margin-left: 20px;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  color: ${p => p.theme.colors.lumerin.placeholderGray};
`;

const WalletInput = styled.input`
  width: 100%;
  height: 40px;
  color: ${p => p.theme.colors.dark};
  font-weight: 300;
  font-size: 16px;
  outline: none;
  border-radius: 5px;
  border-style: solid;
  border-color: ${p => p.theme.colors.lightBG};
  border-width: 1px;
  padding: 8px 60px 6px 60px;
`;

const SendBtn = styled(BaseBtn)`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.lumerin.hypertext - gray : theme.colors.primary};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const FooterRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLabel = styled.label`
  color: ${p => p.theme.colors.dark};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const FooterSublabel = styled.label`
  color: ${p => p.theme.colors.primary};
  font-size: 1.4rem;
`;

// export function ConfirmForm({ activeTab, address, lmrBalanceUSD, sendLmrDisabled, sendLmrDisabledReason, onTabSwitch, amountInput, onAmountInput, destinationAddress, onDestinationAddressInput, onInputChange, usdAmount, coinAmount, onMaxClick }) {
export function ConfirmForm(props) {
  const context = useContext(ToastsContext);
  console.log('PROPS: --------------- ', props);

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
      <HeaderWrapper>
        <BackBtn data-modal="send" onClick={handleTabSwitch}>
          <BackIcon size="2.4rem" fill="black" />
        </BackBtn>
        <Header>You are sending</Header>
      </HeaderWrapper>

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
          {+convertToLMR(props.amountInput).toFixed(2) || 0} LMR
        </AmountSublabel>

        <FeeContainer>
          <FeeRow>
            <FeeLabel>Lumerin Fee</FeeLabel>
            <FeeLabel>{props.gasPrice || 3.45}</FeeLabel>
          </FeeRow>
          <FeeRow>
            <FeeLabel>Network Fee</FeeLabel>
            <FeeLabel>{props.gasPrice || 9}</FeeLabel>
          </FeeRow>
          <FeeRow>
            <FeeLabel>Total</FeeLabel>
            <FeeLabel>${(12.45 / 15.8).toFixed(2)}</FeeLabel>
          </FeeRow>
        </FeeContainer>
      </Column>

      <WalletContainer>
        <WalletInputLabel>To: </WalletInputLabel>
        <WalletInput
          onChange={handleDestinationAddressInput}
          value={props.destinationAddress}
        />
      </WalletContainer>

      <Footer>
        {props.amountInput > 0 && (
          <FooterRow>
            <FooterLabel>LMR Balance</FooterLabel>
            <FooterLabel>
              {convertToLMR(props.amountInput).toFixed(2)} ≈ $
              {props.amountInput}
            </FooterLabel>
          </FooterRow>
        )}
        <SendBtn data-modal="success" onClick={handleTabSwitch}>
          Send now
        </SendBtn>
      </Footer>
    </>
  );
}
