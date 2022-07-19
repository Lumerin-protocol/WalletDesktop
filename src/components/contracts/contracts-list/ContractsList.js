import React, { useState, useEffect } from 'react';
import { List as RVList, AutoSizer, WindowScroller } from 'react-virtualized';
import withContractsListState from '@lumerin/wallet-ui-logic/src/hocs/withContractsListState';
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
  height: 60%;
`;

const ListContainer = styled.div`
  background-color: #ffffff;
  height: 100%;
  overflow-y: auto;
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
  color: ${p => p.theme.colors.darker}
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark}
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

function ContractsList({ hasContracts, contracts, syncStatus }) {
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [scrollElement, setScrollElement] = useState(window);

  useEffect(() => {
    // We need to grab the scrolling div (in <Router/>) to sync with react-virtualized scroll
    const element = document.querySelector('[data-scrollelement]');
    if (!element && process.env.NODE_ENV !== 'test') {
      throw new Error(
        "react-virtualized in Contracts list requires the scrolling parent to have a 'data-scrollelement' attribute."
      );
    }
    // For tests, where this component is rendered in isolation, we default to window
    setScrollElement(element);
    setIsReady(true);
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
      />
    </ContractsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;

  const handleClick = e => {
    e.preventDefault();
    if (!window.isDev || !e.shiftKey || !e.altKey) return;
  };

  if (!isReady) return null;
  return (
    <Container data-testid="Contracts-list">
      <Flex.Row grow="1">
        <Title onClick={handleClick}>Status</Title>
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
                <WindowScroller
                  // WindowScroller is required to sync window scroll with virtualized list scroll.
                  // scrollElement is required because in our layout we're scrolling a div, not window
                  scrollElement={scrollElement}
                >
                  {({ height, isScrolling, onChildScroll, scrollTop }) => {
                    if (!height) return null;
                    return (
                      // AutoSizer is required to make virtualized rows have responsive width
                      <AutoSizer disableHeight>
                        {({ width }) => (
                          <RVList
                            rowRenderer={rowRenderer(filteredItems)}
                            isScrolling={isScrolling}
                            autoHeight
                            scrollTop={scrollTop}
                            rowHeight={66}
                            rowCount={filteredItems.length}
                            onScroll={onChildScroll}
                            height={height || 500} // defaults for tests
                            width={width || 500} // defaults for tests
                          />
                        )}
                      </AutoSizer>
                    );
                  }}
                </WindowScroller>
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
