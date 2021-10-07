import React, { useState, useEffect } from 'react';
import { List as RVList, AutoSizer, WindowScroller } from 'react-virtualized';
import withSocketsListState from 'lumerin-wallet-ui-logic/src/hocs/withSocketsListState';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ScanningSocketsPlaceholder from './ScanningSocketsPlaceholder';
import NoSocketsPlaceholder from './NoSocketsPlaceholder';
import { ItemFilter, Flex } from '../../common';
import ReceiptModal from '../ReceiptModal';
import LogoIcon from '../../icons/LogoIcon';
import Header from './Header';
import SocketsRow from './row/Row';

const Container = styled.div`
  margin-top: 2.4rem;
  background-color: ${p => p.theme.colors.light};

  @media (min-width: 960px) {
  }
`;

const Sockets = styled.div`
  margin: 1.6rem 0 1.6rem;
  border: 1px solid ${p => p.theme.colors.lightBG};
  border-radius: 5px;
`;

const ListContainer = styled.div`
  background-color: #ffffff;
`;

const SocketsRowContainer = styled.div`
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

function SocketsList(props) {
  const [displayAttestations, setDisplayAttestations] = useState(false);
  const [activeModal, setActiveModal] = useState('');
  const [selectedSockets, setSelectedSockets] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [scrollElement, setScrollElement] = useState(window);
  // static propTypes = {
  //   hasSockets: PropTypes.bool.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   isMultiChain: PropTypes.bool.isRequired,
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

  const onCloseModal = () => setActiveModal(null);

  const rowRenderer = sockets => ({ key, index, style }) => (
    <SocketsRowContainer style={style} key={`${key}-${index}`}>
      <SocketsRow
        data-testid="Sockets-row"
        onClick={props.onSocketsClicked}
        socket={sockets[index]}
      />
    </SocketsRowContainer>
  );

  const filterExtractValue = ({ status }) => status;

  const handleClick = e => {
    e.preventDefault();
    if (!window.isDev || !e.shiftKey || !e.altKey) return;
    setDisplayAttestations(!displayAttestations);
  };

  if (!isReady) return null;
  return (
    <Container data-testid="Sockets-list">
      <Flex.Row grow="1">
        <Title onClick={handleClick}>
          Status
          <Subtitle>{8} Machines Connected</Subtitle>
        </Title>
      </Flex.Row>
      <Sockets>
        <ItemFilter
          extractValue={filterExtractValue}
          items={props.sockets.sockets}
        >
          {({ filteredItems, onFilterChange, activeFilter }) => (
            <React.Fragment>
              <Header
                onWalletRefresh={props.onWalletRefresh}
                hasSockets={props.hasSockets}
                onFilterChange={onFilterChange}
                isMultiChain={props.isMultiChain}
                activeFilter={activeFilter}
                syncStatus={props.syncStatus}
              />

              <ListContainer>
                {!props.hasSockets &&
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
                <FooterLogo></FooterLogo>
              </ListContainer>
            </React.Fragment>
          )}
        </ItemFilter>
        <ReceiptModal
          onRequestClose={onCloseModal}
          isOpen={activeModal === 'receipt'}
          hash={selectedSockets}
        />
      </Sockets>
    </Container>
  );
}

export default withSocketsListState(SocketsList);
