import withTxRowState from 'lumerin-wallet-ui-logic/src/hocs/withTxRowState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';
import StatusPillIcon from '../../../icons/StatusPillIcon';

import Details from './Details';
import Amount from './Amount';
import Icon from './Icon';
import IpAddress from './IpAddress';
import Total from './Total';

const Container = styled.div`
  margin-left: 1.6rem;
  padding: 1.2rem 10rem 1.2rem 2.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Label = styled.label`
  color: black;
  font-size: 1rem;
`;

// TODO: rip these out and add in the correct colors
const statusColors = {
  Running: 'teal',
  Available: 'green',
  Pending: 'purple',
  Completed: 'gray'
};

class Row extends React.Component {
  static propTypes = {
    socket: PropTypes.any
  };

  // TODO: Add better padding and pill sizing
  render() {
    const { socket, ...other } = this.props;
    return (
      <Container {...other}>
        <Label>{socket.ipAddress}</Label>
        <Label>
          <StatusPillIcon
            fill={statusColors[socket.status]}
            text={socket.status}
          />
        </Label>
        <Label>{socket.socketAddress}</Label>
        <Label>{socket.total}</Label>
        <Label>{socket.accepted}</Label>
        <Label>{socket.rejected}</Label>
      </Container>
    );
  }
}

export default withTxRowState(Row);
