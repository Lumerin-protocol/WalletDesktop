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
import { lmrDecimals } from '../../../../utils/coinValue';

function HistroyModal(props) {
  const { isActive, close, historyContracts, client } = props;

  const handleClose = e => {
    close(e);
  };
  const handlePropagation = e => e.stopPropagation();

  const history = historyContracts
    .map(hc => hc.history)
    .flat()
    .map(h => {
      const price = parseInt(h.price);
      const speed = parseInt(h.speed);
      const duration = parseInt(h.length);
      const startedAt = parseInt(h.purchaseTime);
      const finishedAt = parseInt(h.endTime);
      const actualDuration = finishedAt - startedAt;
      if (
        [
          price,
          speed,
          duration,
          startedAt,
          finishedAt,
          actualDuration
        ].some(x => isNaN(x))
      ) {
        return null;
      }

      return {
        id: h.id,
        isSuccess: h.isGoodCloseout,
        price,
        startedAt,
        finishedAt,
        speed,
        duration,
        actualDuration
      };
    })
    .filter(h => h !== null)
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
    <HistoryRow
      key={historyContracts[index].id}
      contract={historyContracts[index]}
    />
  );

  return (
    <Modal onClick={handleClose}>
      <Body height={'400px'} onClick={handlePropagation}>
        {CloseModal(handleClose)}
        <TitleWrapper>
          <Title>Purchase history</Title>
        </TitleWrapper>
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
