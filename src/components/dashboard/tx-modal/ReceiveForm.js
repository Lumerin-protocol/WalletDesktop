import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ToastsContext } from '../../toasts';

import QRCode from 'qrcode.react';

import CopyIcon from '../../icons/CopyIcon';
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

const QRContainer = styled.div`
  display: flex;
  align-self: center;
  background: white;
  padding: 1.6rem;

  & canvas {
    display: block;
  }
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
  font-size: 1.6rem;
  font-weight: bold;
`;

const FooterSublabel = styled.label`
  color: ${p => p.theme.colors.primary};
  font-size: 1.4rem;
`;

const CopyBtn = styled(BaseBtn)`
  background-color: ${p => p.theme.colors.light}
  border-radius: 5px;
  border: 1px;
    padding: 0 !important;
    margin: 0 !important;
  :hover {
    padding: 0 !important;
    margin: 0 !important;
  }
`;

export function ReceiveForm({
  activeTab,
  address,
  onTabSwitch,
  sendLmrDisabled,
  sendLmrDisabledReason,
  lmrBalanceUSD,
  lmrBalanceWei,
  copyToClipboard
}) {
  const context = useContext(ToastsContext);

  const handleTabSwitch = e => {
    e.preventDefault();

    onTabSwitch(e.target.dataset.modal);
  };

  const handleCopyToClipboard = () => {
    copyToClipboard(address);
    context.toast('info', 'Address copied to clipboard', {
      autoClose: 1500
    });
  };

  if (!activeTab) {
    return <></>;
  }

  return (
    <>
      <TabWrapper>
        <Tab
          data-modal="send"
          isActive={activeTab === 'send'}
          onClick={handleTabSwitch}
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
      <QRContainer>
        <QRCode value={address} />
      </QRContainer>
      <Footer>
        <FooterRow>
          <FooterBlock>
            <FooterLabel>LMR Address</FooterLabel>
            <FooterSublabel>{abbreviateAddress(address, 10)}</FooterSublabel>
          </FooterBlock>
          <CopyBtn onClick={handleCopyToClipboard}>
            <CopyIcon fill="black" size="3.8rem" />
          </CopyBtn>
        </FooterRow>
        <FooterLabel>LMR Balance</FooterLabel>
        <FooterSublabel>
          {lmrBalanceWei} LMR ≈ ${lmrBalanceUSD}
        </FooterSublabel>
      </Footer>
    </>
  );
}
