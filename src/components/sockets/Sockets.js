import React, { useState } from 'react';
import withSocketsState from '@lumerin/wallet-ui-logic/src/hocs/withSocketsState';
import styled from 'styled-components';

import { AddressHeader } from '../common/AddressHeader';
import TotalsBlock from './TotalsBlock';
import { BaseBtn, Btn } from '../common';
import SocketsList from './sockets-list/SocketsList';
import { LayoutHeader } from '../common/LayoutHeader';
import { View } from '../common/View';

const Container = styled.div`
  background-color: ${p => p.theme.colors.light};
  min-height: 100%;
  width: 100%;
  position: relative;
  padding: 0 2.4rem;
`;

const FixedContainer = styled.div`
  position: sticky;
  z-index: 2;
  right: 0;
  left: 0;
  top: 0;
`;

const Title = styled.div`
  font-size: 2.4rem;
  line-height: 3rem;
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark}
  margin-bottom: 4.8px;
  margin-right: 2.4rem;
  cursor: default;

  @media (min-width: 1140px) {
    margin-right: 0.8rem;
  }

  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

// const Title = styled.h1`
//   font-size: 2.4rem;
//   line-height: 3rem;
//   color: ${p => p.theme.colors.darker}
//   white-space: nowrap;
//   margin: 0;
//   cursor: default;
// `

const Sockets = props => {
  const [activeModal, setActiveModal] = useState('');
  const ipAddress = '127.0.0.1';
  const port = '3000';
  // static propTypes = {
  //   sendDisabledReason: PropTypes.string,
  //   hasSockets: PropTypes.bool.isRequired,
  //   copyToClipboard: PropTypes.func.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   sendDisabled: PropTypes.bool.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   address: PropTypes.string.isRequired
  // };

  const onOpenModal = e => setActiveModal(e.target.dataset.modal);

  const onCloseModal = () => setActiveModal(null);

  return (
    <View data-testid="sockets-container">
      <LayoutHeader
        title="Sockets"
        address={props.address}
        copyToClipboard={props.copyToClipboard}
      />

      <TotalsBlock />

      <SocketsList
        onWalletRefresh={props.onWalletRefresh}
        syncStatus={props.syncStatus}
      />
    </View>
  );
};

export default withSocketsState(Sockets);
