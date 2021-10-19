import React, { useState } from 'react';
import withDashboardState from 'lumerin-wallet-ui-logic/src/hocs/withDashboardState';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { LayoutHeader } from '../common/LayoutHeader';
import BalanceBlock from './BalanceBlock';
import TransactionModal from './tx-modal';
import TxList from './tx-list/TxList';

const Container = styled.div`
  background-color: ${p => p.theme.colors.light};
  min-height: 100%;
  width: 100%;
  position: relative;
  padding: 0 2.4rem;
`;

const Dashboard = ({
  sendDisabled,
  sendDisabledReason,
  isRequired,
  syncStatus,
  address,
  hasTransactions,
  copyToClipboard,
  onWalletRefresh
}) => {
  const [activeModal, setActiveModal] = useState(null);

  const onCloseModal = () => setActiveModal(null);
  const onTabSwitch = modal => setActiveModal(modal);

  return (
    <Container data-testid="dashboard-container">
      <LayoutHeader
        title="My Wallet"
        address={address}
        copyToClipboard={copyToClipboard}
      />

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
};

export default withDashboardState(Dashboard);
