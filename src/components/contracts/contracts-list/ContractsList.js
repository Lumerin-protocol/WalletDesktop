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
import Search from './Search';
import styled from 'styled-components';
import Sort from './Sort';
import { formatExpNumber } from '../utils';
import { Btn } from '../../common';
import { IconTrash } from '@tabler/icons';

const Stats = styled.div`
  color: #0e4353;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  background: white;
  border-radius: 8px;
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

  b {
    margin-left: 3px;
  }
`;

const VerticalDivider = styled.div`
  margin-top: 5px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.25);
  height: 20px;
  border: 0.5px solid rgba(0, 0, 0, 0.25);
`;

const ArchiveBtn = styled(Btn)`
font-weight: 700
display: flex;
justify-content: center;
align-items: center;
  font-size: 1.6rem;
  padding: 0.4rem 1.1rem 0.4rem 0.9rem;
  box-shadow: none;

  svg {
    margin-right: 4px;
  }
  color: ${p => p.theme.colors.primary};
  background-color: transparent;
`;

const sorting = (contracts, sortBy) => {
  if (!sortBy?.value) return contracts;
  switch (sortBy.value) {
    case 'AscPrice':
      return contracts.sort((a, b) => a.price - b.price);
    case 'DescPrice':
      return contracts.sort((a, b) => b.price - a.price);
    case 'AscDuration':
      return contracts.sort((a, b) => a.length - b.length);
    case 'DescDuration':
      return contracts.sort((a, b) => b.length - a.length);
    case 'AscSpeed':
      return contracts.sort((a, b) => a.speed - b.speed);
    case 'DescSpeed':
      return contracts.sort((a, b) => b.speed - a.speed);
    default:
      return contracts;
  }
};

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
  showArchive,
  isSellerTab,
  stats,
  sellerStats,
  onArchiveOpen
}) {
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(null);

  let contractsToShow = search
    ? contracts.filter(c => c.id.toLowerCase().includes(search.toLowerCase()))
    : contracts;

  contractsToShow = sorting(contractsToShow, sort);

  const hasContracts = contractsToShow.length;
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

  return (
    <Container data-testid="Contracts-list">
      <Flex.Row grow="1" style={{ flexDirection: 'column' }}>
        <Flex.Row style={{ justifyContent: 'space-between' }}>
          <StatusHeader refresh={contractsRefresh} syncStatus={syncStatus} />
          <Search onSearch={setSearch} />
        </Flex.Row>

        {isSellerTab ? (
          <Flex.Row
            style={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <ArchiveBtn disabled={showArchive} onClick={onArchiveOpen}>
              <span
                style={{ display: 'flex' }}
                data-rh={`You have no deleted contracts`}
              >
                <IconTrash style={{ display: 'inline-block' }} /> Archive
              </span>
            </ArchiveBtn>
            <Sort sort={sort} setSort={setSort} />
          </Flex.Row>
        ) : (
          <Sort sort={sort} setSort={setSort} />
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}
        >
          {stats && (
            <Stats>
              <StatValue>
                Total: <b>{stats.count}</b>
              </StatValue>
              <VerticalDivider />
              <StatValue>
                Rented: <b>{stats.rented}</b>
              </StatValue>
              <VerticalDivider />
              <StatValue>
                Expires in 1h: <b>{stats.expiresInHour}</b>
              </StatValue>
            </Stats>
          )}
          {sellerStats && (
            <Stats>
              <StatValue>
                Contracts: <b> {sellerStats.count}</b>
              </StatValue>
              <VerticalDivider />
              <StatValue>
                Posted: <b> {sellerStats.totalPosted} TH/s</b>
              </StatValue>
              <VerticalDivider />
              <StatValue>
                Rented: <b> {sellerStats.rented} TH/s</b>
              </StatValue>
              <VerticalDivider />
              <StatValue
                data-rh={`${formatExpNumber(
                  sellerStats.networkReward / 10 ** 6
                )} BTC/TH`}
              >
                Est. Network Profitability:{' '}
                <b> {sellerStats.networkReward} μBTC/TH</b>
              </StatValue>
            </Stats>
          )}
        </div>
      </Flex.Row>
      <Contracts>
        <ItemFilter extractValue={filterExtractValue} items={contractsToShow}>
          {({ filteredItems }) => (
            <React.Fragment>
              <Header
                onFilterChange={() => {}}
                activeFilter={null}
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
                      rowCount={contractsToShow.length}
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
