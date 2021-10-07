import { toChecksumAddress } from 'web3-utils';
import PropTypes from 'prop-types';
import TimeAgo from 'lumerin-wallet-ui-logic/src/components/TimeAgo';
import styled from 'styled-components';
import React from 'react';

import { BaseBtn, Btn } from '../Btn';
import DisplayValue from '../DisplayValue';
import AmountRow from './AmountRow';
import TypeRow from './TypeRow';

const Container = styled.div`
  background-color: ${p => p.theme.colors.medium};
`;

const Scroller = styled.div`
  box-shadow: 0 -1.6rem 1.6rem -1.6rem ${p => p.theme.colors.darkShade} inset;
  overflow-y: auto;
  max-height: 60vh;
`;

const Row = styled.div`
  padding: 1.6rem 0;
  margin: 0 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: ${p =>
    p.first ? 'none' : `1px solid ${p.theme.colors.lightShade}`};
`;

const Label = styled.div`
  line-height: 1.4rem;
  font-size: 1.1rem;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${p => p.theme.colors.copy};
  margin-right: 1.6rem;
  white-space: nowrap;
`;

const Value = styled.div`
  color: ${p => p.theme.colors.copy};
  text-align: right;
  line-height: 1.6rem;
  font-size: 1.3rem;

  &[data-rh] {
    border-bottom: 1px dotted ${p => p.theme.colors.darkShade};
  }
`;

const Address = styled(Value)`
  word-wrap: break-word;
  word-break: break-word;
  font-size: 1.2rem;
`;

const Hash = styled(Value)`
  word-wrap: break-word;
  word-break: break-word;
  font-size: 1.2rem;
`;

const ExplorerBtn = styled(Btn)`
  line-height: 1.5rem;
  opacity: 0.7;
  font-size: 1.4rem;
  letter-spacing: 1.4px;
  border-radius: 0;
`;

const InspectBtn = styled(BaseBtn)`
  letter-spacing: 1.4px;
  color: ${p => p.theme.colors.weak};
  width: 100%;
  font-size: 1.1rem;
  line-height: 2;
  padding: 0 1rem;
  margin: -1rem 0 1rem;
  text-transform: uppercase;
`;

export default class Receipt extends React.Component {
  static propTypes = {
    onExplorerLinkClick: PropTypes.func.isRequired,
    onRefreshRequest: PropTypes.func.isRequired,
    copyToClipboard: PropTypes.func.isRequired,
    confirmations: PropTypes.number.isRequired,
    refreshStatus: PropTypes.oneOf(['init', 'pending', 'success', 'failure'])
      .isRequired,
    refreshError: PropTypes.string,
    coinSymbol: PropTypes.string.isRequired,
    isPending: PropTypes.bool.isRequired,
    tx: PropTypes.object.isRequired,
    hash: PropTypes.string.isRequired
  };

  // eslint-disable-next-line complexity
  render() {
    const { isPending, coinSymbol, tx } = this.props;

    return (
      <Container data-testid="receipt-modal">
        <Scroller>
          {tx.txType !== 'unknown' && tx.txType !== 'attestation' && (
            <Row first>
              <AmountRow
                {...tx}
                coinSymbol={coinSymbol}
                isPending={isPending}
              />
            </Row>
          )}

          {tx.timestamp && tx.formattedTime && (
            <Row>
              <Label>Block mined</Label>
              <Value data-rh={tx.formattedTime}>
                <TimeAgo timestamp={tx.timestamp} />
              </Value>
            </Row>
          )}

          <Row first={tx.txType === 'unknown'}>
            <TypeRow {...tx} />
          </Row>

          {(tx.txType === 'import-requested' ||
            tx.txType === 'imported' ||
            tx.txType === 'exported') &&
            tx.portFee && (
              <Row>
                <Label>Fee</Label>
                <Value>
                  <DisplayValue value={tx.portFee} post=" LMR" />
                </Value>
              </Row>
            )}

          {tx.txType === 'received' && tx.from && (
            <Row>
              <Label>
                {this.props.isPending ? 'Pending' : 'Received'} from
              </Label>
              <Address>{toChecksumAddress(tx.from)}</Address>
            </Row>
          )}

          {tx.txType === 'sent' && tx.to && (
            <Row>
              <Label>{this.props.isPending ? 'Pending' : 'Sent'} to</Label>
              <Address>{toChecksumAddress(tx.to)}</Address>
            </Row>
          )}

          {tx.txType === 'exported' && tx.exportedTo && (
            <Row>
              <Label>{this.props.isPending ? 'Pending' : 'Exported'} to</Label>
              <Value>{tx.exportedTo} blockchain</Value>
            </Row>
          )}

          {tx.txType === 'import-requested' && tx.importedFrom && (
            <Row>
              <Label>
                {this.props.isPending
                  ? 'Pending import request'
                  : 'Import requested'}{' '}
                from
              </Label>
              <Value>{tx.importedFrom} blockchain</Value>
            </Row>
          )}

          {tx.txType === 'imported' && tx.importedFrom && (
            <Row>
              <Label>
                {this.props.isPending ? 'Pending Import' : 'Imported'} from
              </Label>
              <Value>{tx.importedFrom} blockchain</Value>
            </Row>
          )}

          {tx.portDestinationAddress && (
            <Row>
              <Label>Destination Address</Label>
              <Address>{toChecksumAddress(tx.portDestinationAddress)}</Address>
            </Row>
          )}

          <Row>
            <Label>Confirmations</Label>
            <Value>{this.props.confirmations}</Value>
          </Row>

          {tx.portBurnHash && (
            <Row>
              <Label>Port burn hash</Label>
              <Hash>{tx.portBurnHash}</Hash>
            </Row>
          )}

          {tx.gasUsed && (
            <Row>
              <Label>Gas used</Label>
              <Value>{tx.gasUsed}</Value>
            </Row>
          )}

          <Row>
            <Label>Transaction hash</Label>
            <Hash>{this.props.hash}</Hash>
          </Row>

          {tx.blockNumber && (
            <Row>
              <Label>Block number</Label>
              <Hash>{tx.blockNumber}</Hash>
            </Row>
          )}
          {tx.meta && window.isDev && (
            // eslint-disable-next-line no-alert
            <InspectBtn onClick={() => alert(JSON.stringify(tx.meta, null, 2))}>
              Inspect raw metadata
            </InspectBtn>
          )}
        </Scroller>
        <ExplorerBtn onClick={this.props.onExplorerLinkClick} block>
          VIEW IN EXPLORER
        </ExplorerBtn>
      </Container>
    );
  }
}
