import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';

import BackIcon from '../../icons/BackIcon';
import SwapIcon from '../../icons/SwapIcon';
import { BaseBtn } from '../../common';
import Spinner from '../../common/Spinner';
import theme from '../../../ui/theme';
import {
  HeaderWrapper,
  BackBtn,
  Header,
  Footer,
  FooterRow,
  FooterLabel
} from './common';

const AmountContainer = styled.label`
  display: block;
  position: relative;
  font-weight: bold;
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
  padding-top: 5px;
`;

const FeeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FeeLabel = styled.div`
  font-size: 1.2rem;
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

const IconContainer = styled.div`
  margin: 0 auto;
  padding: 5px;
  cursor: pointer;
`;

const SendContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  margin: 16px 0 0;
`;

const LMR_MODE = 'coinAmount';
const USD_MODE = 'usdAmount';

export function ConfirmForm(props) {
  const [mode, setMode] = useState(LMR_MODE);
  const [isPending, setIsPending] = useState(false);

  const context = useContext(ToastsContext);

  const handleSendLmr = async e => {
    e.preventDefault();

    const errorObj = props.validate();
    if (errorObj) {
      const message =
        errorObj.coinAmount ||
        errorObj.toAddress ||
        errorObj.gasLimit ||
        errorObj.gasPrice;
      context.toast('error', message);
      return;
    }

    try {
      setIsPending(true);
      await props.onSubmit();
      props.onTabSwitch('success');
    } catch (err) {
      context.toast('error', err.message);
    }

    setIsPending(false);
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
        <BackBtn data-modal="send" onClick={props.onRequestClose}>
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
          <SubAmount>≈ {props.usdAmount}</SubAmount>
        ) : (
          <SubAmount>≈ {props.coinAmount} LMR</SubAmount>
        )}

        <FeeContainer>
          {props.estimatedFee && (
            <FeeRow>
              <FeeLabel>Estimated fee:</FeeLabel>
              <FeeLabel>{props.estimatedFee} ETH</FeeLabel>
            </FeeRow>
          )}
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
        <FooterRow>
          <FooterLabel>LMR Balance</FooterLabel>
          <FooterLabel>
            {props.lmrBalanceWei} ≈ {props.lmrBalanceUSD}
          </FooterLabel>
        </FooterRow>
        <FooterRow>
          <SendContainer>
            {isPending && <Spinner size="16px" />}
            {!isPending && (
              <SendBtn data-modal="success" onClick={handleSendLmr}>
                Send now
              </SendBtn>
            )}
          </SendContainer>
        </FooterRow>
      </Footer>
    </>
  );
}
