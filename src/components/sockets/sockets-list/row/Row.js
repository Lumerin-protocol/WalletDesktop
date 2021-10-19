import withSocketsRowState from 'lumerin-wallet-ui-logic/src/hocs/withSocketsRowState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import Details from './Details';
import Amount from './Amount';
import IpAddress from './IpAddress';
import Total from './Total';
import { SocketIcon } from '../../../icons/SocketIcon';

const Container = styled.div`
  padding: 1.2rem 1.2rem 1.2rem 2.4rem;
  display: flex;
  align-items: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Value = styled.label`
  color: black;
  font-size: 0.8rem;
  width: 60px;
  margin: 0 0 0 2rem;
`;

const StatusPill = styled.span`
  width: 60px;
  height: 20px;
  border-radius: 5px;
  background-color: ${({ color }) => color};
  font-size: 1rem;
  text-align: center;
  padding: 1px 0;
`;

const statusColors = {
  Running: '#11B4BF',
  Available: '#66BE26',
  Pending: '#8C2AF5',
  Completed: '#DEE3EA'
};

const Row = ({ socket }) => (
  <Container>
    <Value>{socket.ipAddress}</Value>
    <SocketIcon size="2.4rem" fill="black" />
    <StatusPill color={statusColors[socket.status]}>{socket.status}</StatusPill>
    <Value>{socket.socketAddress}</Value>
    <Value>{socket.total}</Value>
    <Value>{socket.accepted}</Value>
    <Value>{socket.rejected}</Value>
  </Container>
);

export default withSocketsRowState(Row);
