import React, { useState, useContext } from 'react';

import withContractsState from '../../store/hocs/withContractsState';
import { LayoutHeader } from '../common/LayoutHeader';
import ContractsList from './contracts-list/ContractsList';
import { View } from '../common/View';
import BuyerHubRow from './contracts-list/BuyerHubRow';
import { ContractsRowContainer } from './contracts-list/ContractsRow.styles';

function BuyerHub({
  contracts,
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
  const contractsToShow = contracts.filter(
    x => x.buyer === address && x.seller !== address
  );

  const tabs = [
    { value: 'timestamp', name: 'Started', ratio: 3 },
    { name: 'Status', ratio: 1 },
    { value: 'price', name: 'Price', ratio: 3 },
    { value: 'length', name: 'Duration', ratio: 3 },
    { value: 'speed', name: 'Speed', ratio: 3 },
    { value: 'action', name: 'Actions', ratio: 3 }
  ];

  const handleContractCancellation = (e, data) => {
    e.preventDefault();

    return client
      .cancelContract({
        contractId: data.contractId,
        walletAddress: data.walletAddress,
        closeOutType: data.closeOutType
      })
      .then(() => contractsRefresh());
  };

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <BuyerHubRow
        data-testid="BuyerHub-row"
        onClick={console.log}
        contract={contractsList[index]}
        cancel={handleContractCancellation}
        address={address}
        ratio={ratio}
      />
    </ContractsRowContainer>
  );

  return (
    <View data-testid="contracts-container">
      <LayoutHeader
        title="Buyer Hub"
        address={address}
        copyToClipboard={copyToClipboard}
      ></LayoutHeader>

      {/* <TotalsBlock /> */}

      <ContractsList
        hasContracts={hasContracts}
        onWalletRefresh={onWalletRefresh}
        syncStatus={syncStatus}
        contractsRefresh={contractsRefresh}
        address={address}
        contracts={contractsToShow}
        customRowRenderer={rowRenderer}
        noContractsMessage={'You have no contracts.'}
        tabs={tabs}
      />
    </View>
  );
}

export default withContractsState(BuyerHub);
