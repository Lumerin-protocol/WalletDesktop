import React, { useContext } from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';

import { ToastsContext } from '../../toasts';
import BackIcon from '../../icons/BackIcon';
import CopyIcon from '../../icons/CopyIcon';
import { BaseBtn } from '../../common';
import {
  HeaderWrapper,
  Header,
  BackBtn,
  Footer,
  FooterRow,
  FooterLabel,
  FooterBlock,
  FooterSublabel
} from './common';
import { abbreviateAddress } from '../../../utils';

const QRContainer = styled.div`
  display: flex;
  align-self: center;
  background: white;
  padding: 1.6rem;

  & canvas {
    display: block;
  }
`;

const CopyBtn = styled(BaseBtn)`
  background-color: ${p => p.theme.colors.light};
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
  onRequestClose,
  lmrBalanceUSD,
  lmrBalanceWei,
  copyToClipboard
}) {
  const context = useContext(ToastsContext);

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
      <HeaderWrapper>
        <BackBtn data-modal="send" onClick={onRequestClose}>
          <BackIcon size="2.4rem" fill="black" />
        </BackBtn>
        <Header>You are receiving</Header>
      </HeaderWrapper>
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
          {lmrBalanceWei} LMR ≈ ${lmrBalanceUSD || 0}
        </FooterSublabel>
      </Footer>
    </>
  );
}
