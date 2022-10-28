import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';

import BackIcon from '../../icons/BackIcon';
import SwapIcon from '../../icons/SwapIcon';

import { BaseBtn } from '../../common';
import theme from '../../../ui/theme';

const HeaderWrapper = styled.div`
  display: flex;
  position: relative;
  height: 10%;
  align-content: center;
`;

const Header = styled.div`
  font-size: 1.6rem;
  font-weight: bold;
  color: ${p => p.theme.colors.dark};
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

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;
const AmountSublabel = styled.label`
  color: ${p => p.theme.colors.dark};
  font-size: 1.4rem;
  text-align: center;
`;

const SubAmount = styled.div`
  color: ${p => p.theme.colors.lumerin.helpertextGray};
  font-size: 13px;
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
  padding: 8px 20px 6px 60px;
`;

const SendBtn = styled(BaseBtn)`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.lumerin.helpertextGray : theme.colors.primary};
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

const FooterLabel = styled.label`
  color: ${p => p.theme.colors.dark};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const IconContainer = styled.div`
  margin: 0 auto;
  padding: 5px;
  cursor: pointer;
`;

const LMR_MODE = 'coinAmount';
const USD_MODE = 'usdAmount';

// export function ConfirmForm({ activeTab, address, lmrBalanceUSD, sendLmrDisabled, sendLmrDisabledReason, onTabSwitch, amountInput, onAmountInput, destinationAddress, onDestinationAddressInput, onInputChange, usdAmount, coinAmount, onMaxClick }) {
export function ConfirmForm(props) {
  const [mode, setMode] = useState(LMR_MODE);

  const context = useContext(ToastsContext);

  const handleTabSwitch = e => {
    e.preventDefault();

    props.onTabSwitch(e.target.dataset.modal);
  };

  const handleSendLmr = e => {
    const errorObj = props.validate();
    if (!errorObj) {
      props.onSubmit();
      handleTabSwitch(e);
    } else {
      const message =
        errorObj.coinAmount ||
        errorObj.toAddress ||
        errorObj.gasLimit ||
        errorObj.gasPrice;
      context.toast('error', message);
    }
  };

  const handleDestinationAddressInput = e => {
    e.preventDefault();

    props.onInputChange(e.target);
    props.onDestinationAddressInput(e.target.value);
  };

  const handleAmountInput = e => {
    e.preventDefault();

    const { value } = e.target;
    props.onInputChange({ id: mode, value });
    props.onAmountInput(value);
  };

  if (!props.activeTab) {
    return <></>;
  }

  const sanitize = amount => (amount === '< 0.01' ? '0.01' : amount);

  const onModeChange = () => {
    const newMode = mode === LMR_MODE ? USD_MODE : LMR_MODE;
    const newAmount = props[newMode];
    setMode(newMode);
    props.onAmountInput(sanitize(newAmount));
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
          <AmountInput
            type="number"
            placeholder={0}
            isActive={true}
            onChange={handleAmountInput}
            value={props.amountInput}
          />
        </AmountContainer>
        <AmountSublabel>{mode === LMR_MODE ? 'LMR' : 'USD'}</AmountSublabel>
        <IconContainer>
          <SwapIcon
            onClick={onModeChange}
            fill={theme.colors.lumerin.helpertextGray}
          ></SwapIcon>
        </IconContainer>
        {mode === LMR_MODE ? (
          <SubAmount>≈ {props.usdAmount}$</SubAmount>
        ) : (
          <SubAmount>≈ {props.coinAmount} LMR</SubAmount>
        )}

        <FeeContainer>
          {/* <FeeRow>
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
          </FeeRow> */}
        </FeeContainer>
      </Column>

      <WalletContainer>
        <WalletInputLabel>To: </WalletInputLabel>
        <WalletInput
          id="toAddress"
          onChange={handleDestinationAddressInput}
          value={props.destinationAddress}
        />
      </WalletContainer>

      <Footer>
        {
          <FooterRow>
            <FooterLabel>LMR Balance</FooterLabel>
            <FooterLabel>
              {props.lmrBalanceWei} ≈ ${props.lmrBalanceUSD}
            </FooterLabel>
          </FooterRow>
        }
        <SendBtn data-modal="success" onClick={handleSendLmr}>
          Send now
        </SendBtn>
      </Footer>
    </>
  );
}
