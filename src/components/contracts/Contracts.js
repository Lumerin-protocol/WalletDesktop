import React, { useState } from 'react';
import styled from 'styled-components';

import withContractsState from '@lumerin/wallet-ui-logic/src/hocs/withContractsState';
import { BaseBtn } from '../common';
import { LayoutHeader } from '../common/LayoutHeader';
import TotalsBlock from './TotalsBlock';
import ContractsList from './contracts-list/ContractsList';
import CreateContractModal from './CreateContractModal';
import { View } from '../common/View';

const Container = styled.div`
  background-color: ${p => p.theme.colors.light};
  min-height: 100%;
  width: 100%;
  position: relative;
  padding: 0 2.4rem;
`;

const Title = styled.div`
  font-size: 2.4rem;
  line-height: 3rem;
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark};
  margin-bottom: 4.8px;
  margin-right: 2.4rem;
  cursor: default;

  @media (min-width: 800px) {
  }
  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

const ContractBtn = styled(BaseBtn)`
  font-size: 1.2rem;
  padding: 1rem 1.4rem;

  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.primary};

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

function Contracts({
  hasContracts,
  copyToClipboard,
  onWalletRefresh,
  syncStatus,
  activeCount,
  draftCount,
  address,
  client,
  contractsRefresh,
  ...props
}) {
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
    setIsModalActive(false);
  };
  const handleContractDeploy = (e, contractDetails) => {
    e.preventDefault();

    client
      .createContract({
        price: contractDetails.price,
        speed: contractDetails.speed,
        duration: contractDetails.time,
        sellerAddress: contractDetails.address
      })
      .then(() => contractsRefresh());

    setIsModalActive(false);
  };

  const handleContractCancellation = (e, data) => {
    e.preventDefault();

    client
      .cancelContract({
        contractId: data.contractId,
        walletAddress: data.walletAddress,
        closeOutType: data.closeOutType
      })
      .then(() => contractsRefresh());
  };

  const handleContractSave = e => {
    e.preventDefault();
  };

  return (
    <View data-testid="contracts-container">
      <LayoutHeader
        title="Contracts"
        address={address}
        copyToClipboard={copyToClipboard}
      >
        <ContractBtn onClick={handleOpenModal}>Create New Contract</ContractBtn>
      </LayoutHeader>

      {/* <TotalsBlock /> */}

      <ContractsList
        hasContracts={hasContracts}
        onWalletRefresh={onWalletRefresh}
        syncStatus={syncStatus}
        cancel={handleContractCancellation}
        contractsRefresh={contractsRefresh}
        address={address}
      />

      <CreateContractModal
        isActive={isModalActive}
        save={handleContractSave}
        deploy={handleContractDeploy}
        close={handleCloseModal}
      />
    </View>
  );
}

export default withContractsState(Contracts);
