import React, { useState } from 'react';
import withContractsState from 'lumerin-wallet-ui-logic/src/hocs/withContractsState';
import styled from 'styled-components';

import AddressHeader from '../common/AddressHeader';
import ReceiveDrawer from './ReceiveDrawer';
import TotalsBlock from './TotalsBlock';
import SendDrawer from './SendDrawer';
import ContractsList from './contracts-list/ContractsList';
import CreateContractModal from './CreateContractModal';

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

function Contracts(props) {
  const [isModalActive, setIsModalActive] = useState(false);
  // static propTypes = {
  //   sendDisabledReason: PropTypes.string,
  //   hasContracts: PropTypes.bool.isRequired,
  //   copyToClipboard: PropTypes.func.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   sendDisabled: PropTypes.bool.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   address: PropTypes.string.isRequired
  // };

  const handleOpenModal = () => setIsModalActive(true);

  const handleCloseModal = e => {
    console.log('event ', e);
    setIsModalActive(false);
  };
  const handleContractDeploy = e => {
    e.preventDefault();
  };
  const handleContractSave = e => {
    e.preventDefault();
  };

  return (
    <Container data-testid="contracts-container">
      <FixedContainer>
        <AddressHeader
          copyToClipboard={props.copyToClipboard}
          address={props.address}
        />
      </FixedContainer>

      <Title>My Contracts</Title>
      <TotalsBlock
        isModalActive={isModalActive}
        onOpenModal={handleOpenModal}
      />

      <ContractsList
        hasContracts={props.hasContracts}
        onWalletRefresh={props.onWalletRefresh}
        syncStatus={props.syncStatus}
      />

      <CreateContractModal
        isActive={isModalActive}
        save={handleContractSave}
        deploy={handleContractDeploy}
        close={handleCloseModal}
      />
    </Container>
  );
}

export default withContractsState(Contracts);
