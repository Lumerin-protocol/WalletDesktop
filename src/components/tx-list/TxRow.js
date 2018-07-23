import { ConverterIcon, DisplayValue, AuctionIcon, TxIcon } from '../common'
import * as selectors from '../../selectors'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import config from '../../config'
import React from 'react'
import theme from '../../theme'
import Web3 from 'web3'

const Container = styled.div`
  margin-left: 1.6rem;
  padding: 1.2rem 2.4rem 1.2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
`

const Pending = styled.div`
  color: #ababab;
  border: 1px solid #ababab;
  border-radius: 1.2rem;
  height: 2.4rem;
  width: 2.4rem;
  line-height: 2.2rem;
  text-align: center;
  font-size: 1.2rem;
`

const Details = styled.div`
  line-height: 1.6rem;
  font-size: 1rem;
  letter-spacing: 0px;
  color: ${p => p.theme.colors.copy};
  text-transform: uppercase;
  opacity: ${({ isPending }) => (isPending ? '0.5' : '1')};
  text-align: right;

  @media (min-width: 800px) {
    font-size: 1.1rem;
    letter-spacing: 0.4px;
  }
`

const Currency = styled.span`
  line-height: 1.6rem;
  font-size: 1.3rem;
  font-weight: 600;
`

const Failed = styled.span`
  line-height: 1.6rem;
  color: ${p => p.theme.colors.danger};
`

const Address = styled.span`
  letter-spacing: normal;
  line-height: 1.6rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: initial;

  @media (min-width: 800px) {
    font-size: 1.3rem;
  }
`

const Amount = styled.div`
  line-height: 2.5rem;
  text-align: right;
  opacity: ${({ isPending }) => (isPending ? '0.5' : '1')};
  color: ${p =>
    p.isPending
      ? p.theme.colors.copy
      : p.isFailed
        ? p.theme.colors.danger
        : p.theme.colors.primary};
  display: flex;
  justify-content: flex-end;
  font-size: 2.3vw;

  @media (min-width: 800px) {
    font-size: 1.8vw;
  }

  @media (min-width: 1040px) {
    font-size: 1.5vw;
  }

  @media (min-width: 1440px) {
    font-size: 2.2rem;
  }
`

const Arrow = styled.span`
  color: ${p => p.theme.colors.primary};
  position: relative;
  top: -0.4em;
  margin: 0 0.5em;
  transform: scale3d(1.5, 2, 1);
  display: inline-block;
`

class TxRow extends React.Component {
  static propTypes = {
    confirmations: PropTypes.number.isRequired,
    parsed: PropTypes.oneOfType([
      PropTypes.shape({
        txType: PropTypes.oneOf(['unknown']).isRequired
      }),

      PropTypes.shape({
        txType: PropTypes.oneOf(['sent']).isRequired,
        symbol: PropTypes.oneOf(['ETH', 'MET']).isRequired,
        value: PropTypes.string.isRequired,
        isCancelApproval: PropTypes.bool.isRequired,
        approvedValue: PropTypes.string,
        isApproval: PropTypes.bool.isRequired,
        to: PropTypes.string.isRequired
      }),

      PropTypes.shape({
        txType: PropTypes.oneOf(['received']).isRequired,
        symbol: PropTypes.oneOf(['ETH', 'MET']).isRequired,
        value: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired
      }),

      PropTypes.shape({
        txType: PropTypes.oneOf(['auction']).isRequired,
        mtnBoughtInAuction: PropTypes.string,
        ethSpentInAuction: PropTypes.string.isRequired
      }),

      PropTypes.shape({
        txType: PropTypes.oneOf(['converted']).isRequired,
        convertedFrom: PropTypes.oneOf(['ETH', 'MET']).isRequired,
        fromValue: PropTypes.string,
        toValue: PropTypes.string
      })
    ]).isRequired
  }

  // Prevent superfluous re-renders to improve performance.
  // Only update while waiting for confirmations.
  shouldComponentUpdate() {
    return this.props.confirmations < 6
  }

  // eslint-disable-next-line complexity
  render() {
    const { confirmations, parsed: tx, ...other } = this.props
    const isFailed =
      (tx.txType === 'auction' &&
        !tx.mtnBoughtInAuction &&
        confirmations > 0) ||
      tx.contractCallFailed
    const isPending = !isFailed && confirmations < 6

    return (
      <Container {...other}>
        {(tx.txType === 'received' || tx.txType === 'sent') &&
          !isPending && (
            <TxIcon
              color={
                tx.contractCallFailed
                  ? theme.colors.danger
                  : theme.colors.primary
              }
            />
          )}

        {tx.txType === 'converted' &&
          !isPending && (
            <ConverterIcon
              color={
                tx.contractCallFailed
                  ? theme.colors.danger
                  : theme.colors.primary
              }
            />
          )}

        {tx.txType === 'auction' &&
          !isPending && (
            <AuctionIcon
              color={
                tx.mtnBoughtInAuction && !tx.contractCallFailed
                  ? theme.colors.primary
                  : theme.colors.danger
              }
            />
          )}

        {(tx.txType === 'unknown' || isPending) && (
          <Pending>{confirmations}</Pending>
        )}
        <div>
          <Amount
            isCancelApproval={tx.isCancelApproval}
            isPending={isPending}
            isFailed={isFailed}
          >
            {tx.txType === 'auction' ? (
              <React.Fragment>
                <DisplayValue value={tx.ethSpentInAuction} post=" ETH" />

                {tx.mtnBoughtInAuction && (
                  <React.Fragment>
                    <Arrow>&rarr;</Arrow>
                    <DisplayValue value={tx.mtnBoughtInAuction} post=" MET" />
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : tx.txType === 'converted' ? (
              <React.Fragment>
                {tx.fromValue ? (
                  <DisplayValue
                    value={tx.fromValue}
                    post={tx.convertedFrom === 'ETH' ? ' ETH' : ' MET'}
                  />
                ) : (
                  <div>New transaction</div>
                )}

                {tx.fromValue &&
                  tx.toValue && (
                    <React.Fragment>
                      <Arrow>&rarr;</Arrow>
                      <DisplayValue
                        value={tx.toValue}
                        post={tx.convertedFrom === 'ETH' ? ' MET' : ' ETH'}
                      />
                    </React.Fragment>
                  )}
              </React.Fragment>
            ) : tx.txType === 'unknown' || tx.isProcessing ? (
              <div>New transaction</div>
            ) : (
              <DisplayValue value={tx.value} post={` ${tx.symbol}`} />
            )}
          </Amount>

          <Details isPending={isPending}>
            {(tx.txType === 'auction' &&
              !isPending &&
              !tx.mtnBoughtInAuction) ||
            tx.contractCallFailed ? (
              <Failed>Failed Transaction</Failed>
            ) : (
              <React.Fragment>
                {tx.txType === 'converted' && (
                  <div>
                    {isPending && 'Pending conversion from '}
                    <Currency>{tx.convertedFrom}</Currency>
                    {isPending ? ' to ' : ' converted to '}
                    <Currency>
                      {tx.convertedFrom === 'ETH' ? 'MET' : 'ETH'}
                    </Currency>
                  </div>
                )}

                {tx.txType === 'received' && (
                  <div>
                    {isPending ? 'Pending' : 'Received'} from{' '}
                    <Address>{Web3.utils.toChecksumAddress(tx.from)}</Address>
                  </div>
                )}

                {tx.txType === 'auction' && (
                  <div>
                    <Currency>MET</Currency> purchased in auction
                  </div>
                )}

                {tx.txType === 'sent' && (
                  <div>
                    {isPending
                      ? tx.isApproval
                        ? 'Pending allowance for'
                        : tx.isCancelApproval
                          ? 'Pending cancel allowance for'
                          : 'Pending to'
                      : tx.isApproval
                        ? 'Allowance set for'
                        : tx.isCancelApproval
                          ? 'Allowance cancelled for'
                          : 'Sent to'}{' '}
                    {tx.to === config.MET_TOKEN_ADDR ? (
                      'MET TOKEN CONTRACT'
                    ) : tx.to === config.CONVERTER_ADDR ? (
                      'CONVERTER CONTRACT'
                    ) : (
                      <Address>{Web3.utils.toChecksumAddress(tx.to)}</Address>
                    )}
                  </div>
                )}
                {tx.txType === 'unknown' && <div>Waiting for metadata</div>}
              </React.Fragment>
            )}
          </Details>
        </div>
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => ({
  confirmations: selectors.getTxConfirmations(state, props)
})

export default connect(mapStateToProps)(TxRow)
