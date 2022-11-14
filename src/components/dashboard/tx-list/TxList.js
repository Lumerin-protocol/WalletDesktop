import React, { useState } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import styled from 'styled-components';

import withTxListState from '../../../store/hocs/withTxListState';
import ScanningTxPlaceholder from './ScanningTxPlaceholder';
import NoTxPlaceholder from './NoTxPlaceholder';
import { ItemFilter, Flex } from '../../common';
import Header from './Header';
import TxRow from './row/Row';

const Container = styled.div`
  margin-top: 2.4rem;
  padding: 1.8rem 0;
  background-color: ${p => p.theme.colors.light};
  height: 100%;

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
  height: calc(100vh - 370px);
`;

const TxRowContainer = styled.div`
  &:hover {
    background-color: rgba(126, 97, 248, 0.1);
  }
`;

const Title = styled.div`
  font-size: 2.4rem;
  line-height: 3rem;
  white-space: nowrap;
  margin: 0;
  font-weight: 500;
  color: ${p => p.theme.colors.primary};
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

export const TxList = ({
  transactions,
  hasTransactions,
  onWalletRefresh,
  syncStatus,
  client
}) => {
  // static propTypes = {
  //   hasTransactions: PropTypes.bool.isRequired,
  //   onWalletRefresh: PropTypes.func.isRequired,
  //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired,
  //   items: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       txType: PropTypes.string.isRequired,
  //       hash: PropTypes.string.isRequired
  //     })
  //   ).isRequired
  // };

  const [selectedTx, setSelectedTx] = useState(null);

  const onTxClicked = ({ currentTarget }) => {
    // if (!window.isDev || !e.shiftKey || !e.altKey) return;
    setSelectedTx(currentTarget.dataset.hash);

    client.onTransactionLinkClick(currentTarget.dataset.hash);
  };

  const rowRenderer = transactionList => ({ key, style, index }) => (
    <TxRowContainer style={style} key={`${key}-${transactionList[index].hash}`}>
      <TxRow
        data-testid="tx-row"
        data-hash={transactionList[index].hash}
        onClick={onTxClicked}
        tx={transactionList[index]}
      />
    </TxRowContainer>
  );

  const handleClick = e => {
    if (!window.isDev || !e.shiftKey || !e.altKey) return;

    client.onTransactionLinkClick(e.currentTarget.dataset.hash);
  };

  return (
    <Container data-testid="tx-list">
      <Flex.Row grow="1">
        <Title>Transactions</Title>
      </Flex.Row>
      <Transactions>
        <ItemFilter
          extractValue={({ txType }) => txType}
          items={transactions.filter(({ txType }) => txType)}
        >
          {({ filteredItems, onFilterChange, activeFilter }) => (
            <React.Fragment>
              <Header
                onWalletRefresh={onWalletRefresh}
                hasTransactions={hasTransactions}
                onFilterChange={onFilterChange}
                activeFilter={activeFilter}
                syncStatus={syncStatus}
              />

              <ListContainer>
                {!transactions.length &&
                  (syncStatus === 'syncing' ? (
                    <ScanningTxPlaceholder />
                  ) : (
                    <NoTxPlaceholder />
                  ))}
                <AutoSizer>
                  {({ width, height }) => (
                    <RVList
                      rowRenderer={rowRenderer(filteredItems)}
                      rowHeight={66}
                      rowCount={filteredItems.length}
                      height={height || 500} // defaults for tests
                      width={width || 500} // defaults for tests
                    />
                  )}
                </AutoSizer>
              </ListContainer>
            </React.Fragment>
          )}
        </ItemFilter>
      </Transactions>
    </Container>
  );
};

export default withTxListState(TxList);
