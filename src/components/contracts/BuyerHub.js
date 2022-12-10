import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { uniqueId } from 'lodash';

import withContractsState from '../../store/hocs/withContractsState';
import { Btn } from '../common';
import { LayoutHeader } from '../common/LayoutHeader';
import ContractsList from './contracts-list/ContractsList';
import { View } from '../common/View';
import { ToastsContext } from '../toasts';
import BuyerHubRow from './contracts-list/BuyerHubRow';
import { ContractsRowContainer } from './contracts-list/ContractsRow.styles';

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
  const context = useContext(ToastsContext);
  const contractsToShow = contracts.filter(x => x.buyer === address);

  const tabs = [
    { value: 'timestamp', name: 'Started', ratio: 2 },
    { ratio: 1 },
    { value: 'price', name: 'Price', ratio: 3 },
    { value: 'length', name: 'Duration', ratio: 3 },
    { value: 'speed', name: 'Speed (TH/s)', ratio: 3 }
  ];

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <BuyerHubRow
        data-testid="BuyerHub-row"
        onClick={console.log}
        contract={contractsList[index]}
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
        cancel={() => {}}
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
