import React from 'react';
import withBalanceBlockState from '../../store/hocs/withBalanceBlockState';
import { LumerinLightIcon } from '../icons/LumerinLightIcon';
import { EtherIcon } from '../icons/EtherIcon';
import { Balance } from './Balance';
import {
  WalletBalanceHeader,
  Btn,
  BtnAccent,
  BtnRow,
  SecondaryContainer,
  Container,
  Primary,
  CoinsRow,
  BalanceContainer
} from './BalanceBlock.styles';

const WalletBalance = ({
  lmrBalance,
  lmrBalanceUSD,
  ethBalance,
  ethBalanceUSD
}) => (
  <BalanceContainer>
    <WalletBalanceHeader>Wallet Balance</WalletBalanceHeader>
    <CoinsRow>
      <Primary data-testid="lmr-balance">
        <Balance
          currency="LMR"
          value={lmrBalance}
          icon={<LumerinLightIcon size="4rem" />}
          equivalentUSD={lmrBalanceUSD}
          maxSignificantFractionDigits={0}
        />
      </Primary>
      <Primary data-testid="eth-balance">
        <Balance
          currency="ETH"
          value={ethBalance}
          icon={<EtherIcon size="3.3rem" />}
          equivalentUSD={ethBalanceUSD}
          maxSignificantFractionDigits={5}
        />
      </Primary>
    </CoinsRow>
  </BalanceContainer>
);

const BalanceBlock = ({
  lmrBalance,
  lmrBalanceUSD,
  ethBalance,
  ethBalanceUSD,
  sendDisabled,
  sendDisabledReason,
  onTabSwitch
}) => {
  const handleTabSwitch = e => {
    e.preventDefault();
    onTabSwitch(e.target.dataset.modal);
  };

  return (
    <Container>
      <SecondaryContainer>
        <WalletBalance
          {...{ lmrBalance, lmrBalanceUSD, ethBalance, ethBalanceUSD }}
        />
        <BtnRow>
          <BtnAccent
            data-modal="receive"
            data-testid="receive-btn"
            onClick={handleTabSwitch}
            block
          >
            Receive
          </BtnAccent>
          <Btn
            data-modal="send"
            data-disabled={sendDisabled}
            data-rh={sendDisabledReason}
            data-testid="send-btn"
            onClick={sendDisabled ? null : handleTabSwitch}
            block
          >
            Send
          </Btn>
        </BtnRow>
      </SecondaryContainer>
    </Container>
  );
};

export default withBalanceBlockState(BalanceBlock);
