import React from 'react';
import styled from 'styled-components';

import withSocketsRowState from '@lumerin/wallet-ui-logic/src/hocs/withSocketsRowState';
import { SocketIcon } from '../../icons/SocketIcon';

const columnCount = 4;

const calcWidth = n => 100 / n;

const Container = styled.div`
  padding: 1.2rem 0;
  display: flex;
  text-align: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Value = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: ${calcWidth(columnCount) + 10}%;
  color: black;
  font-size: 1.2rem;
`;

const AssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: ${calcWidth(columnCount) + 10}%;
`;

const SmallAssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: ${calcWidth(columnCount)}%;
`;

const StatusPill = styled.span`
  border-radius: 5px;
  background-color: ${({ color }) => color};
  font-size: 1rem;
  padding: 0.6rem 1rem;
  max-width: 75%;
`;

const statusColors = {
  Running: '#11B4BF',
  Available: '#66BE26',
  Pending: '#8C2AF5',
  Completed: '#DEE3EA'
};

const Row = ({ socket }) => {
  return (
    <Container>
      <Value>{socket.ipAddress}</Value>
      <SmallAssetContainer>
        <SocketIcon size="3rem" fill="black" />
      </SmallAssetContainer>
      <AssetContainer>
        <StatusPill color={statusColors[socket.status]}>
          {socket.status}
        </StatusPill>
      </AssetContainer>
      <Value>{socket.socketAddress}</Value>
      {/* <Value>{socket.total}</Value>
      <Value>{socket.accepted}</Value>
      <Value>{socket.rejected}</Value> */}
    </Container>
  );
};

export default withSocketsRowState(Row);
