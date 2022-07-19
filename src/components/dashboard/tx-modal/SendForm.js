import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';

import { BaseBtn } from '../../common';
import { abbreviateAddress } from '../../../utils';

const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 10%;
  padding: 0 2rem;
`;

const Tab = styled(BaseBtn)`
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.dark};
  font-weight: bold;
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
  text-shadow: 0 0 0 #2196f3;
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : theme.colors.dark};
  &:focus {
    outline: none;
  }

  ::placeholder {
    color: ${p => p.theme.colors.dark};
  }
`;
const AmountSublabel = styled.label`
  color: ${p => p.theme.colors.dark};
  font-size: 1.4rem;
  text-align: center;
`;

const SendAllBtn = styled(BaseBtn)`
  background-color: none;
  color: ${p => p.theme.colors.primary};
  font-weight: 800;
  margin-top: 15px;
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

const ConfirmBtn = styled(BaseBtn)`
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

export function SendForm({
  activeTab,
  address,
  lmrBalanceUSD,
  sendLmrDisabled,
  sendLmrDisabledReason,
  onTabSwitch,
  amountInput,
  onAmountInput,
  destinationAddress,
  onDestinationAddressInput,
  onInputChange,
  usdAmount,
  coinAmount,
  onMaxClick
}) {
  const context = useContext(ToastsContext);

  const handleTabSwitch = e => {
    e.preventDefault();

    onTabSwitch(e.target.dataset.modal);
  };

  const handleDestinationAddressInput = e => {
    e.preventDefault();

    onDestinationAddressInput(e.target.value);
  };

  const handleAmountInput = e => {
    e.preventDefault();

    onAmountInput(e.target.value);
    onInputChange(e);
  };

  if (!activeTab) {
    return <></>;
  }

  const convertToLMR = val => {
    return val * 15.8;
  };

  return (
    <>
      <TabWrapper>
        <Tab
          data-modal="send"
          data-rh={sendLmrDisabledReason}
          isActive={activeTab === 'send'}
          onClick={sendLmrDisabled ? null : handleTabSwitch}
        >
          Send
        </Tab>
        <Tab
          data-modal="receive"
          isActive={activeTab === 'receive'}
          onClick={handleTabSwitch}
        >
          Receive
        </Tab>
      </TabWrapper>
      <Column>
        <AmountContainer>
          <Currency isActive={amountInput > 0}>$</Currency>
          <AmountInput
            id="usdAmount"
            placeholder={0}
            isActive={amountInput > 0}
            onChange={handleAmountInput}
            value={amountInput}
          />
        </AmountContainer>
        <AmountSublabel>
          {convertToLMR(amountInput).toFixed(2) || 0} LMR
        </AmountSublabel>
        <SendAllBtn onClick={onMaxClick}>Max</SendAllBtn>
      </Column>

      <WalletContainer>
        <WalletInputLabel>To: </WalletInputLabel>
        <WalletInput
          onChange={handleDestinationAddressInput}
          value={destinationAddress}
        />
      </WalletContainer>

      <Footer>
        {
          <FooterRow>
            <FooterLabel>LMR Balance</FooterLabel>
            <FooterLabel>
              {convertToLMR(amountInput).toFixed(2)} ≈ ${amountInput}
            </FooterLabel>
          </FooterRow>
        }
        <ConfirmBtn data-modal="confirm" onClick={handleTabSwitch}>
          Confirm
        </ConfirmBtn>
      </Footer>
    </>
  );
}
