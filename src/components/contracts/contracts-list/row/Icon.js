import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'lumerin-wallet-ui-logic/src/theme';
import React from 'react';

import ConverterIcon from '../../../icons/ConverterIcon';
import AuctionIcon from '../../../icons/AuctionIcon';
import ImportIcon from '../../../icons/ImportIcon';
import ExportIcon from '../../../icons/ExportIcon';
import TxIcon from '../../../icons/TxIcon';

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
  static propTypes = {
    confirmations: PropTypes.number.isRequired,
    isPending: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
    contractType: PropTypes.oneOf([
      'import-requested',
      'attestation',
      'converted',
      'received',
      'imported',
      'exported',
      'auction',
      'unknown',
      'sent'
    ]).isRequired
  };

  render() {
    const color = this.props.isFailed
      ? theme.colors.danger
      : theme.colors.primary;

    if (this.props.contractType === 'unknown' || this.props.isPending) {
      return <Pending>{this.props.confirmations}</Pending>;
    }

    switch (this.props.contractType) {
      case 'converted':
        return <ConverterIcon color={color} />;
      case 'auction':
        return <AuctionIcon color={color} />;
      case 'import-requested':
      case 'imported':
        return <ImportIcon color={color} />;
      case 'exported':
        return <ExportIcon color={color} />;
      default:
        return <TxIcon color={color} />;
    }
  }
}
