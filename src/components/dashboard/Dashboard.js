import React, { useState } from 'react';
import withDashboardState from 'lumerin-wallet-ui-logic/src/hocs/withDashboardState';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AddressHeader from '../common/AddressHeader';
import ReceiveModal from './tx-modal';
import BalanceBlock from './BalanceBlock';
import SendDrawer from './SendDrawer';
import TransactionModal from './tx-modal';
import { BaseBtn, Btn } from '../common';
import TxList from './tx-list/TxList';

const Container = styled.div`
  background-color: ${p => p.theme.colors.light};
  min-height: 100%;
  position: relative;
  padding: 0 2.4rem 2.4rem;

  @media (min-width: 800px) {
  }
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

function Dashboard({
  sendDisabled,
  sendDisabledReason,
  isRequired,
  syncStatus,
  address,
  hasTransactions,
  copyToClipboard,
  onWalletRefresh
}) {
  const [activeModal, setActiveModal] = useState(null);

  const onCloseModal = () => setActiveModal(null);
  const onTabSwitch = modal => setActiveModal(modal);

  return (
    <Container data-testid="dashboard-container">
      <FixedContainer>
        <AddressHeader copyToClipboard={copyToClipboard} address={address} />
      </FixedContainer>

      <Title>My Wallet</Title>
      <BalanceBlock sendDisabled={sendDisabled} onTabSwitch={onTabSwitch} />

      <TxList
        hasTransactions={hasTransactions}
        onWalletRefresh={onWalletRefresh}
        syncStatus={syncStatus}
      />

      <TransactionModal
        onRequestClose={onCloseModal}
        onTabSwitch={onTabSwitch}
        activeTab={activeModal}
      />
    </Container>
  );
}

export default withDashboardState(Dashboard);
