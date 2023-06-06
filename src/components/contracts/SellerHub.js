import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { uniqueId } from 'lodash';

import withContractsState from '../../store/hocs/withContractsState';
import { Btn } from '../common';
import { LayoutHeader } from '../common/LayoutHeader';
import TotalsBlock from './TotalsBlock';
import ContractsList from './contracts-list/ContractsList';
import CreateContractModal from './modals/CreateContractModal';
import { View } from '../common/View';
import { ToastsContext } from '../toasts';
import { CONTRACT_STATE } from '../../enums';
import { lmrDecimals } from '../../utils/coinValue';
import { formatBtcPerTh } from './utils';

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

const tabs = [
  { name: 'Status', ratio: 1 },
  { value: 'price', name: 'Price', ratio: 1 },
  { value: 'btc-th', name: 'BTC/TH', ratio: 1 },
  { value: 'length', name: 'Duration', ratio: 1 },
  { value: 'speed', name: 'Speed', ratio: 1 },
  { value: 'action', name: 'Actions', ratio: 2 }
];

function SellerHub({
  contracts,
  hasContracts,
  copyToClipboard,
  syncStatus,
  activeCount,
  draftCount,
  address,
  client,
  contractsRefresh,
  allowSendTransaction,
  networkDifficulty,
  ...props
}) {
  const [isModalActive, setIsModalActive] = useState(false);
  const context = useContext(ToastsContext);
  const [showSuccess, setShowSuccess] = useState(false);

  // static propTypes = {
  //   sendDisabledReason: PropTypes.string,
  //   hasContracts: PropTypes.bool.isRequired,
  //   copyToClipboard: PropTypes.func.isRequired,
  //   sendDisabled: PropTypes.bool.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   address: PropTypes.string.isRequired
  // };

  const handleOpenModal = () => setIsModalActive(true);

  const handleCloseModal = e => {
    setIsModalActive(false);
    setShowSuccess(false);
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

  const handleContractDeploy = async (e, contractDetails) => {
    e.preventDefault();

    const contract = {
      price: contractDetails.price * lmrDecimals,
      speed: contractDetails.speed * 10 ** 12, // THs
      duration: contractDetails.time * 3600, // Hours to seconds
      sellerAddress: contractDetails.address
    };

    const tempContractId = uniqueId();
    createTempContract(tempContractId, contract);

    await client.lockSendTransaction();
    await client
      .createContract(contract)
      .then(() => {
        setShowSuccess(true);
      })
      .catch(error => {
        context.toast('error', error.message || error);
        setIsModalActive(false);
      })
      .finally(() => {
        removeTempContract(tempContractId, contract);
        client.unlockSendTransaction();
      });
  };

  const handleContractCancellation = data => {
    client.lockSendTransaction();
    return client
      .cancelContract({
        contractId: data.contractId,
        walletAddress: data.walletAddress,
        closeOutType: data.closeOutType
      })
      .finally(() => {
        client.unlockSendTransaction();
      });
  };

  const handleDeleteContract = data => {
    client.lockSendTransaction();
    return client
      .deleteContract({
        contractId: data.contractId,
        walletAddress: data.walletAddress
      })
      .finally(() => {
        client.unlockSendTransaction();
      });
  };

  const handleContractSave = e => {
    e.preventDefault();
  };
  const contractsToShow = contracts.filter(
    c => c.seller === address && !c.isDead
  );

  const rentedContracts =
    contractsToShow?.filter(x => Number(x.state) === 1) ?? [];
  const speedReducer = (acc, c) => acc + Number(c.speed) / 10 ** 12;
  const sellerStats = {
    count: contractsToShow.length ?? 0,
    rented: rentedContracts.reduce(speedReducer, 0),
    totalPosted: contractsToShow.reduce(speedReducer, 0),
    networkReward: formatBtcPerTh(networkDifficulty)
  };

  return (
    <View data-testid="contracts-container">
      <LayoutHeader
        title="Seller Hub"
        address={address}
        copyToClipboard={copyToClipboard}
      >
        <ContractBtn
          data-disabled={!allowSendTransaction}
          onClick={allowSendTransaction ? handleOpenModal : () => {}}
        >
          Create Contract
        </ContractBtn>
      </LayoutHeader>

      {/* <TotalsBlock /> */}

      <ContractsList
        hasContracts={hasContracts}
        syncStatus={syncStatus}
        cancel={handleContractCancellation}
        deleteContract={handleDeleteContract}
        contractsRefresh={contractsRefresh}
        address={address}
        contracts={contractsToShow}
        allowSendTransaction={allowSendTransaction}
        noContractsMessage={'You have no contracts.'}
        tabs={tabs}
        sellerStats={sellerStats}
      />

      <CreateContractModal
        isActive={isModalActive}
        save={handleContractSave}
        deploy={handleContractDeploy}
        close={handleCloseModal}
        showSuccess={showSuccess}
      />
    </View>
  );
}

export default withContractsState(SellerHub);
