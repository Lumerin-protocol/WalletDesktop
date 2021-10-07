import { List as RVList, AutoSizer, WindowScroller } from 'react-virtualized';
import withTxListState from 'lumerin-wallet-ui-logic/src/hocs/withTxListState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import ScanningTxPlaceholder from './ScanningTxPlaceholder';
import NoTxPlaceholder from './NoTxPlaceholder';
import { ItemFilter, Flex } from '../../common';
import ReceiptModal from '../ReceiptModal';
import LumerinLightIcon from '../../icons/LumerinLightIcon';
import Header from './Header';
import TxRow from './row/Row';
import { DummyTx } from '../../../dummy';

const Container = styled.div`
  margin-top: 2.4rem;
  padding: 1.8rem 0;
  background-color: ${p => p.theme.colors.light};

  @media (min-width: 960px) {
  }
`;

const Transactions = styled.div`
  margin: 1.6rem 0 1.6rem;
  border: 1px solid ${p => p.theme.colors.lightBG};
  border-radius: 5px;
`;

const ListContainer = styled.div`
  background-color: #ffffff;
`;

const TxRowContainer = styled.div`
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

class TxList extends React.Component {
  // static propTypes = {
  //   hasTransactions: PropTypes.bool.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   isMultiChain: PropTypes.bool.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   items: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       txType: PropTypes.string.isRequired,
  //       hash: PropTypes.string.isRequired
  //     })
  //   ).isRequired
  // };

  state = {
    displayAttestations: false,
    activeModal: null,
    selectedTx: null,
    isReady: false
  };

  componentDidMount() {
    // We need to grab the scrolling div (in <Router/>) to sync with react-virtualized scroll
    const element = document.querySelector('[data-scrollelement]');
    if (!element && process.env.NODE_ENV !== 'test') {
      throw new Error(
        "react-virtualized in transactions list requires the scrolling parent to have a 'data-scrollelement' attribute."
      );
    }
    // For tests, where this component is rendered in isolation, we default to window
    this.scrollElement = element || window;
    this.setState({ isReady: true });
  }

  onTxClicked = ({ currentTarget }) => {
    this.setState({
      activeModal: 'receipt',
      selectedTx: currentTarget.dataset.hash
    });
  };

  onCloseModal = () => this.setState({ activeModal: null });

  rowRenderer = items => ({ key, style, index }) => (
    <TxRowContainer style={style} key={`${key}-${items[index].hash}`}>
      <TxRow
        data-testid="tx-row"
        data-hash={items[index].hash}
        onClick={this.onTxClicked}
        tx={items[index]}
      />
    </TxRowContainer>
  );

  filterExtractValue = ({ txType }) =>
    ['import-requested', 'imported', 'exported', 'attestation'].includes(txType)
      ? 'ported'
      : txType;

  handleClick = e => {
    if (!window.isDev || !e.shiftKey || !e.altKey) return;
    this.setState(state => ({
      ...state,
      displayAttestations: !state.displayAttestations
    }));
  };

  render() {
    if (!this.state.isReady) return null;
    return (
      <Container data-testid="tx-list">
        <Flex.Row grow="1">
          <Title onClick={this.handleClick}>Transactions</Title>
        </Flex.Row>
        <Transactions>
          <ItemFilter
            extractValue={this.filterExtractValue}
            items={this.props.items.filter(({ txType }) =>
              this.state.displayAttestations ? true : txType !== 'attestation'
            )}
          >
            {({ filteredItems, onFilterChange, activeFilter }) => (
              <React.Fragment>
                <Header
                  onWalletRefresh={this.props.onWalletRefresh}
                  hasTransactions={this.props.hasTransactions}
                  onFilterChange={onFilterChange}
                  isMultiChain={this.props.isMultiChain}
                  activeFilter={activeFilter}
                  syncStatus={this.props.syncStatus}
                />

                <ListContainer>
                  {!this.props.hasTransactions &&
                    (this.props.syncStatus === 'syncing' ? (
                      <ScanningTxPlaceholder />
                    ) : (
                      <NoTxPlaceholder />
                    ))}
                  <WindowScroller
                    // WindowScroller is required to sync window scroll with virtualized list scroll.
                    // scrollElement is required because in our layout we're scrolling a div, not window
                    scrollElement={this.scrollElement}
                  >
                    {({ height, isScrolling, onChildScroll, scrollTop }) => {
                      if (!height) return null;
                      return (
                        // AutoSizer is required to make virtualized rows have responsive width
                        <AutoSizer disableHeight>
                          {({ width }) => (
                            <RVList
                              rowRenderer={this.rowRenderer(filteredItems)}
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
            onRequestClose={this.onCloseModal}
            isOpen={this.state.activeModal === 'receipt'}
            hash={this.state.selectedTx}
          />
        </Transactions>
      </Container>
    );
  }
}

export default withTxListState(TxList);
