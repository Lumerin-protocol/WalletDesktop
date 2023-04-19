import React, { useState, useEffect } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import withContractsListState from '../../../store/hocs/withContractsListState';
import ScanningContractsPlaceholder from './ScanningContractsPlaceholder';
import NoContractsPlaceholder from './NoContractsPlaceholder';
import { ItemFilter, Flex } from '../../common';
import Header from './Header';
import ContractsRow from './Row';
import {
  Container,
  ListContainer,
  Contracts,
  FooterLogo
} from './ContractsList.styles';
import { ContractsRowContainer } from './ContractsRow.styles';
import StatusHeader from './StatusHeader';

function ContractsList({
  contracts,
  syncStatus,
  cancel,
  address,
  contractsRefresh,
  noContractsMessage,
  customRowRenderer,
  allowSendTransaction,
  tabs
}) {
  const [selectedContracts, setSelectedContracts] = useState([]);
  const hasContracts = contracts.length;
  const defaultTabs = [
    { value: 'timestamp', name: 'Started', ratio: 2 },
    { name: 'Status', ratio: 1 },
    { value: 'price', name: 'Price', ratio: 2 },
    { value: 'length', name: 'Duration', ratio: 2 },
    { value: 'speed', name: 'Speed', ratio: 2 },
    { value: 'action', name: 'Actions', ratio: 3 }
  ];

  const tabsToShow = tabs || defaultTabs;
  const ratio = tabsToShow.map(x => x.ratio);

  useEffect(() => {
    contractsRefresh();
  }, []);

  const onContractsClicked = ({ currentTarget }) => {
    setSelectedContracts(currentTarget.dataset.hash);
  };

  const rowRenderer = (contractsList, ratio) => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <ContractsRow
        data-testid="Contracts-row"
        onClick={onContractsClicked}
        contract={contractsList[index]}
        cancel={cancel}
        address={address}
        ratio={ratio}
        allowSendTransaction={allowSendTransaction}
      />
    </ContractsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;

  return (
    <Container data-testid="Contracts-list">
      <Flex.Row grow="1">
        <StatusHeader refresh={contractsRefresh} syncStatus={syncStatus} />
      </Flex.Row>
      <Contracts>
        <ItemFilter extractValue={filterExtractValue} items={contracts}>
          {({ filteredItems, onFilterChange, activeFilter }) => (
            <React.Fragment>
              <Header
                onFilterChange={onFilterChange}
                activeFilter={activeFilter}
                syncStatus={syncStatus}
                tabs={tabsToShow}
              />

              <ListContainer>
                {!hasContracts &&
                  (syncStatus === 'syncing' ? (
                    <ScanningContractsPlaceholder />
                  ) : (
                    <NoContractsPlaceholder
                      message={
                        syncStatus === 'failed'
                          ? 'Failed to retrieve contracts'
                          : noContractsMessage
                      }
                    />
                  ))}
                <AutoSizer>
                  {({ width, height }) => (
                    <RVList
                      rowRenderer={
                        customRowRenderer
                          ? customRowRenderer(filteredItems, ratio)
                          : rowRenderer(filteredItems, ratio)
                      }
                      rowHeight={66}
                      rowCount={contracts.length}
                      height={height || 500} // defaults for tests
                      width={width || 500} // defaults for tests
                    />
                  )}
                </AutoSizer>
                <FooterLogo></FooterLogo>
              </ListContainer>
            </React.Fragment>
          )}
        </ItemFilter>
      </Contracts>
    </Container>
  );
}

export default withContractsListState(ContractsList);
