import React, { useState, useEffect } from 'react';
import { List as RVList, AutoSizer, WindowScroller } from 'react-virtualized';
import withSocketsListState from '@lumerin/wallet-ui-logic/src/hocs/withSocketsListState';
import styled from 'styled-components';

import ScanningSocketsPlaceholder from './ScanningSocketsPlaceholder';
import NoSocketsPlaceholder from './NoSocketsPlaceholder';
import { ItemFilter } from '../../common';
import Header from './Header';
import SocketsRow from './Row';

const Container = styled.div`
  margin-top: 2.4rem;
  background-color: ${p => p.theme.colors.light};
  height: 100%;

  @media (min-width: 960px) {
  }
`;

const Sockets = styled.div`
  margin: 1.6rem 0 1.6rem;
  border: 1px solid ${p => p.theme.colors.lightBG};
  border-radius: 5px;
  height: 60%;
`;

const ListContainer = styled.div`
  background-color: #ffffff;
  overflow-y: scroll;
  height: ${p => p.count * 66 + 'px'};
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SocketsRowContainer = styled.div`
  &:hover {
    background-color: rgba(126, 97, 248, 0.1);
  }
`;

const Subtitle = styled.div`
  font-size: 1.4rem;
  align-self: end;
  line-height: 2rem;
  white-space: nowrap;
  margin: 0 1.2rem;
  display: inline;
  font-weight: 400;
  color: ${p => p.theme.colors.primary}
  cursor: default;

  @media (min-width: 1140px) {
    margin-right: 0.8rem;
  }

  @media (min-width: 1200px) {
    margin-right: 1.6rem;
  }
`;

const SocketsList = props => {
  const [isReady, setIsReady] = useState(false);
  const [scrollElement, setScrollElement] = useState(window);
  // static propTypes = {
  //   hasSockets: PropTypes.bool.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   items: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       SocketsType: PropTypes.string.isRequired,
  //       hash: PropTypes.string.isRequired
  //     })
  //   ).isRequired
  // };

  useEffect(() => {
    // We need to grab the scrolling div (in <Router/>) to sync with react-virtualized scroll
    const element = document.querySelector('[data-scrollelement]');
    if (!element && process.env.NODE_ENV !== 'test') {
      throw new Error(
        "react-virtualized in Sockets list requires the scrolling parent to have a 'data-scrollelement' attribute."
      );
    }
    // For tests, where this component is rendered in isolation, we default to window
    setScrollElement(element);
    setIsReady(true);
  }, []);

  const rowRenderer = sockets => ({ key, index, style }) => (
    <SocketsRowContainer style={style} key={`${key}-${index}`}>
      <SocketsRow
        data-testid="Sockets-row"
        // onClick={props.onSocketsClicked}
        socket={sockets[index]}
      />
    </SocketsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;

  const handleClick = e => {
    e.preventDefault();
    if (!window.isDev || !e.shiftKey || !e.altKey) return;
  };

  if (!isReady) return null;
  return (
    <Container data-testid="Sockets-list">
      {/* <Subtitle>
        {props.ipAddress} : {props.port}
      </Subtitle> */}
      <Sockets>
        <ItemFilter extractValue={filterExtractValue} items={props.connections}>
          {({ filteredItems, onFilterChange, activeFilter }) => (
            <React.Fragment>
              <Header
                // onWalletRefresh={props.onWalletRefresh}
                // hasConnections={props.hasConnections}
                onFilterChange={onFilterChange}
                activeFilter={activeFilter}
                syncStatus={props.syncStatus}
              />

              <ListContainer count={props.connections.length}>
                {!props.hasConnections &&
                  (props.syncStatus === 'syncing' ? (
                    <ScanningSocketsPlaceholder />
                  ) : (
                    <NoSocketsPlaceholder />
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
              </ListContainer>
            </React.Fragment>
          )}
        </ItemFilter>
      </Sockets>
    </Container>
  );
};

export default withSocketsListState(SocketsList);
