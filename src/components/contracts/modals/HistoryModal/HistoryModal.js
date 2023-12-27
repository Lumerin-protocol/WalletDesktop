import React, { useEffect, useState } from 'react';
import { List as RVList, AutoSizer } from 'react-virtualized';
import {
  Modal,
  Body,
  TitleWrapper,
  Title,
  Subtitle,
  CloseModal
} from '../CreateContractModal.styles';
import HistoryRow from './HistoryRow';
import { withClient } from '../../../../store/hocs/clientContext';
import Spinner from '../../../common/Spinner';

function HistroyModal(props) {
  const { isActive, close, client, contracts, address } = props;

  const [historyContracts, setHistory] = useState({});
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    if (!isActive) {
      return;
    }
    if (contracts.length) {
      setLoading(true);
    }
    let loaded = 0;
    for (let i = 0; i < contracts.length; i += 1) {
      const c = contracts[i];
      client
        .getContractHistory({ contractAddr: c.id, walletAddress: address })
        .then(history => {
          if (history.length > 0) {
            setHistory(prev => ({
              ...prev,
              [c.id]: history
            }));
          }
        })
        .catch(err => {})
        .finally(() => {
          loaded += 1;
          if (loaded === contracts.length) {
            setLoading(false);
          }
        });
    }
  }, [isActive]);

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  const history = Object.values(historyContracts)
    .flat()
    .map(h => {
      return {
        id: h.id,
        isSuccess: h[0],
        price: +h[3],
        startedAt: +h[1],
        finishedAt: +h[2],
        speed: +h[4],
        duration: +h[5],
        actualDuration: +h[2] - +h[1]
      };
    })
    .map(h => {
      return {
        ...h,
        payed: h.isSuccess ? h.price : (h.actualDuration / h.duration) * h.price
      };
    })
    .sort((a, b) => b.finishedAt - a.finishedAt);

  if (!isActive) {
    return <></>;
  }

  const rowRenderer = historyContracts => ({ key, index, style }) => (
    <HistoryRow key={`${index}`} contract={historyContracts[index]} />
  );

  return (
    <Modal onClick={handleClose}>
      <Body height={'400px'} onClick={handlePropagation}>
        {CloseModal(handleClose)}
        <TitleWrapper>
          <Title>Purchase history</Title>
        </TitleWrapper>
        {isLoading && !history.length && (
          <Subtitle>
            Loading... <Spinner size="16px"></Spinner>
          </Subtitle>
        )}
        {!isLoading && !history.length && <Subtitle>No history found</Subtitle>}
        <AutoSizer width={400}>
          {({ width, height }) => (
            <RVList
              rowRenderer={rowRenderer(history)}
              rowHeight={50}
              rowCount={history.length}
              height={height || 500} // defaults for tests
              width={width || 500} // defaults for tests
            />
          )}
        </AutoSizer>
      </Body>
    </Modal>
  );
}

export default withClient(HistroyModal);
