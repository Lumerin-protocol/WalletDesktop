import React, { useState, useEffect } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import withContractsListState from '../../../store/hocs/withContractsListState';
import styled from 'styled-components';

import ScanningContractsPlaceholder from './ScanningContractsPlaceholder';
import NoContractsPlaceholder from './NoContractsPlaceholder';
import { ItemFilter, Flex } from '../../common';
import Header from './Header';
import ContractsRow from './Row';

const Container = styled.div`
  margin-top: 2.4rem;
  background-color: ${p => p.theme.colors.light};
  height: 100%;

  @media (min-width: 800px) {
  }
  @media (min-width: 1200px) {
  }
`;

const Contracts = styled.div`
  margin: 1.6rem 0 1.6rem;
  border: 1px solid ${p => p.theme.colors.lightBG};
  border-radius: 5px;
`;

const ListContainer = styled.div`
  background-color: #ffffff;
  height: calc(100vh - 250px);

  /*
  ::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 800px) {
  }
  @media (min-width: 1200px) {
  }
  */
`;

const ContractsRowContainer = styled.div`
  &:hover {
    background-color: rgba(126, 97, 248, 0.1);
  }
`;

const FooterLogo = styled.div`
  padding: 4.8rem 0;
  width: 3.2rem;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 2.4rem;
  line-height: 3rem;
  color: ${p => p.theme.colors.darker};
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark};
  margin-bottom: 4.8px;
  margin-right: 2.4rem;
  cursor: default;

  @media (min-width: 1140px) {
    margin-right: 0.8rem;
  }

  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

function ContractsList({
  hasContracts,
  contracts,
  syncStatus,
  cancel,
  address,
  contractsRefresh
}) {
  const [selectedContracts, setSelectedContracts] = useState([]);

  useEffect(() => {
    contractsRefresh();
  }, []);

  const onContractsClicked = ({ currentTarget }) => {
    setSelectedContracts(currentTarget.dataset.hash);
  };

  const rowRenderer = contractsList => ({ key, index, style }) => (
    <ContractsRowContainer style={style} key={`${key}-${index}`}>
      <ContractsRow
        data-testid="Contracts-row"
        onClick={onContractsClicked}
        contract={contractsList[index]}
        cancel={cancel}
        address={address}
      />
    </ContractsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;

  const handleClick = e => {
    e.preventDefault();
    if (!window.isDev || !e.shiftKey || !e.altKey) return;
  };

  return (
    <Container data-testid="Contracts-list">
      <Flex.Row grow="1">
        <Title onClick={handleClick}>Status: {syncStatus}</Title>
      </Flex.Row>
      <Contracts>
        <ItemFilter extractValue={filterExtractValue} items={contracts}>
          {({ filteredItems, onFilterChange, activeFilter }) => (
            <React.Fragment>
              <Header
                onFilterChange={onFilterChange}
                activeFilter={activeFilter}
                syncStatus={syncStatus}
              />

              <ListContainer>
                {!hasContracts &&
                  (syncStatus === 'syncing' ? (
                    <ScanningContractsPlaceholder />
                  ) : (
                    <NoContractsPlaceholder />
                  ))}
                <AutoSizer>
                  {({ width, height }) => (
                    <RVList
                      rowRenderer={rowRenderer(filteredItems)}
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
