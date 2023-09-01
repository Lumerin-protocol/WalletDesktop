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
import { Btn } from '../../common';

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

const ContractBtn = styled(Btn)`
  font-size: 1.3rem;
  padding: 0.6rem 1.4rem;

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

const SearchSortWrapper = styled.div`
  display: flex;
`;

const sorting = (contracts, sortBy) => {
  switch (sortBy?.value) {
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
    case 'AvailableFirst':
      return contracts.sort((a, b) => (+b.state > +a.state ? -1 : 1));
    case 'RunningFirst':
      return contracts.sort((a, b) => (+b.state > +a.state ? 1 : -1));
    default:
      return contracts.sort((a, b) => (+b.state > +a.state ? -1 : 1));
  }
};

function ContractsList({
  contracts,
  syncStatus,
  cancel,
  deleteContract,
  createContract,
  address,
  contractsRefresh,
  noContractsMessage,
  customRowRenderer,
  allowSendTransaction,
  tabs,
  isSellerTab,
  stats,
  edit,
  setEditContractData,
  sellerStats
}) {
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(null);

  const [headerOptions, setHeaderOptions] = useState({});

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

  const rowRenderer = (contractsList, ratio, converters) => ({
    key,
    index,
    style
  }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <ContractsRow
        data-testid="Contracts-row"
        onClick={onContractsClicked}
        contract={contractsList[index]}
        cancel={cancel}
        deleteContract={deleteContract}
        converters={converters}
        address={address}
        ratio={ratio}
        edit={edit}
        setEditContractData={setEditContractData}
        allowSendTransaction={allowSendTransaction}
      />
    </ContractsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;
  return (
    <Container data-testid="Contracts-list">
      <Flex.Row grow="1" style={{ flexDirection: 'column' }}>
        <Flex.Row style={{ justifyContent: 'space-between', margin: '10px 0' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isSellerTab ? (
              <ContractBtn
                data-disabled={!allowSendTransaction}
                onClick={allowSendTransaction ? createContract : () => {}}
              >
                Create Contract
              </ContractBtn>
            ) : (
              <></>
            )}
            {/* <Sort sort={sort} setSort={setSort} /> */}
            <StatusHeader refresh={contractsRefresh} syncStatus={syncStatus} />
          </div>
          <SearchSortWrapper>
            <Sort sort={sort} setSort={setSort} />
            <Search onSearch={setSearch} />
          </SearchSortWrapper>
          {/* <StatusHeader refresh={contractsRefresh} syncStatus={syncStatus} /> */}
        </Flex.Row>

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
              // data-rh={
              //   sellerStats.networkReward
              //     ? `${formatExpNumber(
              //         fromMicro(sellerStats.networkReward)
              //       )} BTC/TH/day`
              //     : 'Calculating...'
              // }
              >
                Est. Network Profitability:{' '}
                <b>
                  {sellerStats.networkReward
                    ? `${sellerStats.networkReward} BTC/TH/day`
                    : 'Calculating...'}
                </b>
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
                onColumnOptionChange={e =>
                  setHeaderOptions({
                    ...headerOptions,
                    [e.type]: e.value
                  })
                }
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
                          ? customRowRenderer(
                              filteredItems,
                              ratio,
                              headerOptions
                            )
                          : rowRenderer(filteredItems, ratio, headerOptions)
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
