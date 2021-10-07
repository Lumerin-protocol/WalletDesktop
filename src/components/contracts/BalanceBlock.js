import withBalanceBlockState from 'lumerin-wallet-ui-logic/src/hocs/withBalanceBlockState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { BaseBtn, Btn, DisplayValue } from '../common';

const convertLmrToEth = () => {};

const relSize = ratio => `calc(100vw / ${ratio})`;

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0.75em 1.6rem;
  width: 35%;
  @media (min-width: 1040px) {
    padding: 0.95em 0;
  }
`;

const CoinSymbol = styled.div`
  border-radius: 14.1px;
  background-color: ${p => p.theme.colors.primary};
  width: 4rem;
  line-height: 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  @media (min-width: 1040px) {
    line-height: 3.2rem;
    width: 6.3rem;
    font-size: 2rem;
  }
`;

const Value = styled.div`
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: ${p => (p.large ? '-1px' : 'inherit')};
  color: ${p => p.theme.colors.darker}
  margin: 0 1.6rem;
  flex-grow: 1;
  position: relative;
  top: ${relSize(-400)};
  font-size: ${relSize(32)};

  @media (min-width: 800px) {
    font-size: ${relSize(44)};
  }

  @media (min-width: 1040px) {
    font-size: ${({ large }) => relSize(large ? 40 : 52)};
  }

  @media (min-width: 1440px) {
    font-size: ${({ large }) => (large ? '3.6rem' : '2.8rem')};
  }
`;

const USDValue = styled.div`
  display: block;
  line-height: 1.5;
  font-weight: 600;
  color: ${p => p.theme.colors.darker}
  white-space: nowrap;
  position: relative;
  top: ${relSize(-400)};
  font-size: ${relSize(36)};

  @media (min-width: 800px) {
    font-size: ${relSize(68)};
  }

  @media (min-width: 1440px) {
    font-size: 2.2rem;
  }
`;

const SendBtn = styled(BaseBtn)`
  width: 30%;
  height: 50%;
  font-size: 1.5rem;
  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.light}
  color: ${p => p.theme.colors.secondary}

  @media (min-width: 1040px) {
    margin-left: 0;
    margin-top: 1.6rem;
  }
`;

const ReceiveBtn = styled(BaseBtn)`
  width: 30%;
  height: 50%;
  font-size: 1.5rem;
  border-radius: 5px;
  background-color: ${p => p.theme.colors.primary}
  color: ${p => p.theme.colors.light}

  @media (min-width: 1040px) {
    margin-left: 0;
    margin-top: 1.6rem;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  background-color: ${p => p.theme.colors.lightShade};
  border-radius: 4px;
  padding: 0 1.2rem;
  @media (min-width: 1040px) {
    padding: 0 2.4rem;
  }
`;

class BalanceBlock extends React.Component {
  static propTypes = {
    coinBalanceUSD: PropTypes.string.isRequired,
    coinBalanceWei: PropTypes.string.isRequired,
    lmrBalanceWei: PropTypes.string.isRequired,
    coinSymbol: PropTypes.string.isRequired
  };

  render() {
    return (
      <React.Fragment>
        <Balance>
          {
            // TODO: ADD LMR logo //
          }
          <Value data-testid="lmr-balance" large>
            <DisplayValue value={this.props.lmrBalanceWei} />
          </Value>
          <USDValue data-testid="lmr-balance-usd" hide>
            ETH ≈ {this.props.lmrBalanceWei}
          </USDValue>
        </Balance>
        <ReceiveBtn
          data-testid="receive-btn"
          data-modal="receive"
          onClick={this.onOpenModal}
          block
        >
          Receive
        </ReceiveBtn>

        <SendBtn
          data-disabled={this.props.sendDisabled}
          data-testid="send-btn"
          data-modal="send"
          onClick={this.props.sendDisabled ? null : this.onOpenModal}
          data-rh={this.props.sendDisabledReason}
          block
        >
          Send
        </SendBtn>
      </React.Fragment>
    );
  }
}

export default withBalanceBlockState(BalanceBlock);
