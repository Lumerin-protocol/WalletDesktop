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
import styled from 'styled-components';
import TotalIcon from '../../icons/TotalIcon';
import RentedIcon from '../../icons/RentedIcon';
import ExpiresIcon from '../../icons/ExpiresIcon';

const Stats = styled.div`
  color: #0e4353;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  flex-wrap: wrap;
`;

const StatValue = styled.div`
  background-color: white;
  padding: 5px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  font-size: 1.5rem;
  border-radius: 8px;
`;

function ContractsList({
  contracts,
  syncStatus,
  cancel,
  deleteContract,
  address,
  contractsRefresh,
  noContractsMessage,
  customRowRenderer,
  allowSendTransaction,
  tabs,
  stats,
  sellerStats
}) {
  const [selectedContracts, setSelectedContracts] = useState([]);
  const hasContracts = contracts.length;
  const defaultTabs = [
    { value: 'timestamp', name: 'Started', ratio: 2 },
    { name: 'Status', ratio: 1 },
    { value: 'price', name: 'Price', ratio: 2 },
    { value: 'length', name: 'Duration', ratio: 2 },
    { value: 'speed', name: 'Speed', ratio: 2 },
    { value: 'action', name: '', ratio: 3 }
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
        deleteContract={deleteContract}
        address={address}
        ratio={ratio}
        allowSendTransaction={allowSendTransaction}
      />
    </ContractsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;

  const iconStyles = { width: '15px', marginRight: '4px' };

  return (
    <Container data-testid="Contracts-list">
      <Flex.Row grow="1" style={{ flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}
        >
          <StatusHeader refresh={contractsRefresh} syncStatus={syncStatus} />
          {stats && (
            <Stats>
              <StatValue>
                <TotalIcon style={iconStyles} />
                Total: <b>{stats.count}</b>
              </StatValue>
              <StatValue>
                <RentedIcon style={iconStyles} />
                Rented: <b>{stats.rented}</b>
              </StatValue>
              <StatValue>
                <ExpiresIcon style={iconStyles} />
                Expires in an hour: <b>{stats.expiresInHour}</b>
              </StatValue>
            </Stats>
          )}
          {sellerStats && (
            <Stats>
              <StatValue>
                Contracts: <b> {sellerStats.count}</b>
              </StatValue>
              <StatValue>
                Posted: <b> {sellerStats.totalPosted} TH/s</b>
              </StatValue>
              <StatValue>
                Rented: <b> {sellerStats.rented} TH/s</b>
              </StatValue>
              <StatValue>
                Network Reward: <b> {sellerStats.networkReward}</b>
              </StatValue>
            </Stats>
          )}
        </div>
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
