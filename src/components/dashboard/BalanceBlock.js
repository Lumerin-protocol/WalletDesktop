import React, { useState, useContext } from 'react';
import useRecaptcha from 'use-recaptcha-v3';
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
  BalanceContainer,
  GlobalContainer
} from './BalanceBlock.styles';
import Spinner from '../common/Spinner';
import { ToastsContext } from '../toasts';

const WalletBalance = ({
  lmrBalance,
  lmrBalanceUSD,
  ethBalance,
  ethBalanceUSD
}) => (
  <BalanceContainer>
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
  recaptchaSiteKey,
  onTabSwitch,
  client
}) => {
  const handleTabSwitch = e => {
    e.preventDefault();
    onTabSwitch(e.target.dataset.modal);
  };
  const [isClaiming, setClaiming] = useState(false);
  const context = useContext(ToastsContext);

  const { status, getRecaptchaToken } = useRecaptcha({
    siteKey: recaptchaSiteKey
  });

  const { ready } = status;

  const claimFaucet = e => {
    e.preventDefault();
    setClaiming(true);

    getRecaptchaToken('submit')
      .then(token => {
        return client
          .claimFaucet({ token })
          .then(() => {
            context.toast(
              'success',
              'Succesfully claimed 10 sLMR and 0.1 sETH'
            );
          })
          .catch(err => {
            if (err.message === 'Request failed with status code 403') {
              context.toast('error', 'You already claimed today. Try later.');
            } else {
              context.toast('error', 'Failed to claim. Try later.');
            }
          });
      })
      .catch(err => {
        context.toast('error', `Captcha is not verified: ${err}`);
      })
      .finally(() => setClaiming(false));
  };

  return (
    <GlobalContainer>
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
            {isClaiming ? (
              <div style={{ paddingLeft: '20px' }}>
                <Spinner size="25px" />
              </div>
            ) : ready ? (
              <BtnAccent
                data-modal="claim"
                onClick={claimFaucet}
                data-rh={`Payout from the faucet is 10 sLMR and 0.1 sETH per day.\n
                Wallet addresses are limited to one request every 24 hours.`}
                block
              >
                Get Tokens
              </BtnAccent>
            ) : (
              <></>
            )}
          </BtnRow>
        </SecondaryContainer>
      </Container>
    </GlobalContainer>
  );
};

export default withBalanceBlockState(BalanceBlock);
