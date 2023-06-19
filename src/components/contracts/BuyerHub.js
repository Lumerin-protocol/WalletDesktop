import React from 'react';

import withContractsState from '../../store/hocs/withContractsState';
import { LayoutHeader } from '../common/LayoutHeader';
import { View } from '../common/View';
import BuyerHubRow from './contracts-list/BuyerHubRow';
import ContractsList from './contracts-list/ContractsList';
import { ContractsRowContainer } from './contracts-list/ContractsRow.styles';

function BuyerHub({
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
  ...props
}) {
  const contractsToShow = contracts.filter(
    x => x.buyer === address && x.seller !== address
  );

  const tabs = [
    { value: 'id', name: 'Contract', ratio: 3 },
    { value: 'timestamp', name: 'Started', ratio: 3 },
    { name: 'Status', ratio: 1 },
    { value: 'price', name: 'Price', ratio: 2 },
    { value: 'length', name: 'Duration', ratio: 2 },
    { value: 'speed', name: 'Speed', ratio: 2 },
    { value: 'action', name: 'Actions', ratio: 2 }
  ];

  const handleContractCancellation = (e, data) => {
    e.preventDefault();

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

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <BuyerHubRow
        data-testid="BuyerHub-row"
        allowSendTransaction={allowSendTransaction}
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
