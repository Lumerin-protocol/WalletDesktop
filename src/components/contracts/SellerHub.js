import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { uniqueId } from 'lodash';

import withContractsState from '../../store/hocs/withContractsState';
import { Btn } from '../common';
import { LayoutHeader } from '../common/LayoutHeader';
import TotalsBlock from './TotalsBlock';
import ContractsList from './contracts-list/ContractsList';
import CreateContractModal from './CreateContractModal';
import { View } from '../common/View';
import { ToastsContext } from '../toasts';
import { CONTRACT_STATE } from '../../enums';
import { lmrEightDecimals } from '../../store/utils/coinValue';

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

const ContractBtn = styled(Btn)`
  font-size: 1.3rem;
  padding: 1rem 1.4rem;

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

function SellerHub({
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
  const context = useContext(ToastsContext);

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

  const createTempContract = (id, contract) => {
    client.store.dispatch({
      type: 'create-temp-contract',
      payload: {
        id,
        ...contract,
        length: contract.duration,
        seller: contract.sellerAddress,
        state: CONTRACT_STATE.Avaliable,
        timestamp: 0,
        isDeploying: true
      }
    });
  };

  const removeTempContract = (id, contract) => {
    client.store.dispatch({
      type: 'remove-contract',
      payload: {
        id,
        ...contract
      }
    });
  };

  const handleContractDeploy = (e, contractDetails) => {
    e.preventDefault();

    const contract = {
      price: contractDetails.price * lmrEightDecimals,
      speed: contractDetails.speed * 10 ** 12, // THs
      duration: contractDetails.time * 3600, // Hours to seconds
      sellerAddress: contractDetails.address
    };

    const tempContractId = uniqueId();
    createTempContract(tempContractId, contract);

    client
      .createContract(contract)
      .then(() => contractsRefresh())
      .catch(error => {
        context.toast('error', error.message || error);
        removeTempContract(tempContractId, contract);
      });

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
        title="Seller Hub"
        address={address}
        copyToClipboard={copyToClipboard}
      >
        <ContractBtn onClick={handleOpenModal}>Create Contract</ContractBtn>
      </LayoutHeader>

      {/* <TotalsBlock /> */}

      <ContractsList
        hasContracts={hasContracts}
        onWalletRefresh={onWalletRefresh}
        syncStatus={syncStatus}
        cancel={handleContractCancellation}
        contractsRefresh={contractsRefresh}
        address={address}
        showAddressContractsOnly={true}
        noContractsMessage={'You have no contracts.'}
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

export default withContractsState(SellerHub);
