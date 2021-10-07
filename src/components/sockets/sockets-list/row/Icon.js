import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'lumerin-wallet-ui-logic/src/theme';
import React from 'react';

import ConverterIcon from '../../../icons/ConverterIcon';
import AuctionIcon from '../../../icons/AuctionIcon';
import ImportIcon from '../../../icons/ImportIcon';
import ExportIcon from '../../../icons/ExportIcon';
import TxIcon from '../../../icons/TxIcon';
import StatusPillIcon from '../../../icons/StatusPillIcon';

const Pending = styled.div`
  color: #ababab;
  border: 1px solid #ababab;
  border-radius: 1.2rem;
  height: 2.4rem;
  width: 2.4rem;
  line-height: 2.2rem;
  text-align: center;
  font-size: 1.2rem;
`;

export default class Icon extends React.Component {
  // static propTypes = {
  //   confirmations: PropTypes.number.isRequired,
  //   isPending: PropTypes.bool.isRequired,
  //   isFailed: PropTypes.bool.isRequired,
  //   socketType: PropTypes.oneOf([
  //     available,
  //     inUse,
  //     offline,
  //     pending
  //   ]).isRequired
  // };

  render() {
    const color = this.props.isFailed
      ? theme.colors.danger
      : theme.colors.primary;

    // if (this.props.socketType === 'unknown' || this.props.isPending) {
    //   return <Pending>{this.props.confirmations}</Pending>;
    // }

    switch (this.props.socketType) {
      case 'available':
        <StatusPillIcon text="Available" fill="#42A1A2" />;
      case 'in-use':
        <StatusPillIcon text="In-Use" fill="#8C2AF5" />;
      case 'pending':
        <StatusPillIcon text="Pending" fill="" />;
      default:
        <StatusPillIcon text="Offline" fill="#DB2642" />;
    }
  }
}
