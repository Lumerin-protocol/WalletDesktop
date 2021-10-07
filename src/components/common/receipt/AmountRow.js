import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import DisplayValue from '../DisplayValue';

const Label = styled.div`
  line-height: 1.4rem;
  font-size: 1.1rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.copy};
  margin-right: 1.6rem;
  white-space: nowrap;
`;

const Amount = styled.div`
  color: ${p => p.theme.colors.primary};
  line-height: 2.5rem;
  text-align: right;
`;

const Arrow = styled.span`
  color: ${p => p.theme.colors.primary};
  position: relative;
  margin: 0 12px;
  transform: scale3d(1.5, 1.5, 1);
  display: inline-block;
`;

export default class AmountRow extends React.Component {
  static propTypes = {
    lmrBoughtInAuction: PropTypes.string,
    coinSpentInAuction: PropTypes.string,
    convertedFrom: PropTypes.string,
    coinSymbol: PropTypes.string.isRequired,
    isPending: PropTypes.bool.isRequired,
    fromValue: PropTypes.string,
    toValue: PropTypes.string,
    txType: PropTypes.oneOf([
      'import-requested',
      'converted',
      'exported',
      'imported',
      'received',
      'auction',
      'unknown',
      'sent'
    ]).isRequired,
    symbol: PropTypes.string,
    value: PropTypes.string
  };

  // eslint-disable-next-line complexity
  render() {
    return (
      <React.Fragment>
        <Label>Amount</Label>
        <Amount isPending={this.props.isPending}>
          {this.props.txType === 'auction' ? (
            <React.Fragment>
              <DisplayValue
                maxSize="1.6rem"
                isCoin
                value={this.props.coinSpentInAuction}
              />
              {this.props.lmrBoughtInAuction && (
                <React.Fragment>
                  <Arrow>&darr;</Arrow>
                  <DisplayValue
                    maxSize="1.6rem"
                    value={this.props.lmrBoughtInAuction}
                    post=" LMR"
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : this.props.txType === 'converted' ? (
            <React.Fragment>
              <DisplayValue
                maxSize="1.6rem"
                value={this.props.fromValue}
                post={
                  this.props.convertedFrom === 'coin'
                    ? ` ${this.props.coinSymbol}`
                    : ' LMR'
                }
              />
              {this.props.toValue && (
                <React.Fragment>
                  <Arrow>&darr;</Arrow>
                  <DisplayValue
                    maxSize="1.6rem"
                    value={this.props.toValue}
                    post={
                      this.props.convertedFrom === 'coin'
                        ? ' LMR'
                        : ` ${this.props.coinSymbol}`
                    }
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <DisplayValue
              maxSize="2rem"
              value={this.props.value}
              post={
                this.props.txType === 'import-requested' ||
                this.props.txType === 'imported' ||
                this.props.txType === 'exported'
                  ? ' LMR'
                  : ` ${
                      this.props.symbol === 'coin'
                        ? this.props.coinSymbol
                        : this.props.symbol
                    }`
              }
            />
          )}
        </Amount>
      </React.Fragment>
    );
  }
}
