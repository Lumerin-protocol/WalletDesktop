import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useTimer } from 'react-timer-hook';
import { ToastsContext } from '../../toasts';

import withContractsRowState from '../../../store/hocs/withContractsRowState';

import { Btn } from '../../common';
import { CLOSEOUT_TYPE, CONTRACT_STATE } from '../../../enums';
import Spinner from '../../common/Spinner';
import { ClockIcon } from '../../icons/ClockIcon';
import theme from '../../../ui/theme';
import {
  formatDuration,
  formatSpeed,
  formatTimestamp,
  formatPrice,
  isContractClosed,
  getContractState,
  getContractEndTimestamp
} from '../utils';
import {
  ActionButton,
  ActionButtons,
  SmallAssetContainer
} from './ContractsRow.styles';

const Container = styled.div`
  padding: 1.2rem 0;
  display: grid;
  grid-template-columns: ${p => p.ratio.map(x => `${x}fr`).join(' ')};
  text-align: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Value = styled.label`
  display: flex;
  padding: 0 3rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.primary};
  font-size: 1.2rem;
`;

const STATE_COLOR = {
  [CONTRACT_STATE.Running]: theme.colors.warning,
  [CONTRACT_STATE.Avaliable]: theme.colors.success
};

function Row({ contract, cancel, address, ratio, explorerUrl }) {
  // TODO: Add better padding
  const context = useContext(ToastsContext);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [contract]);

  const handleCancel = closeOutType => e => {
    e.stopPropagation();
    e.preventDefault();
    setIsPending(true);
    cancel(e, {
      contractId: contract.id,
      walletAddress: contract.seller,
      closeOutType
    }).catch(e => {
      const action =
        closeOutType === CLOSEOUT_TYPE.Claim ? 'claim funds' : 'close contract';
      context.toast('error', `Failed to ${action}: ${e.message}`);
      setIsPending(false);
    });
  };

  const contractEndTimestamp = getContractEndTimestamp(contract);
  const timer = useTimer({ expiryTimestamp: new Date(contractEndTimestamp) });

  const isContractExpired = () => {
    return (
      contract.state !== CONTRACT_STATE.Avaliable &&
      Date.now() > contractEndTimestamp
    );
  };

  const getClaimDisabledReason = () => {
    if (contract.balance === '0') {
      return 'Balance is empty';
    }
    return null;
  };

  const isClaimBtnDisabled = () => {
    return contract.balance === '0';
  };

  const getClockColor = contract => {
    return STATE_COLOR[contract.state];
  };

  return (
    <Container ratio={ratio} onClick={() => window.openLink(explorerUrl)}>
      <Value>
        {formatTimestamp(contract.timestamp, timer, contract.state)}
      </Value>
      <SmallAssetContainer data-rh={getContractState(contract)}>
        <ClockIcon size="3rem" fill={getClockColor(contract)} />
      </SmallAssetContainer>
      <Value>{formatPrice(contract.price)} LMR</Value>
      <Value>{formatDuration(contract.length)}</Value>
      <Value>{formatSpeed(contract.speed)}</Value>
      {contract.seller === address &&
        (isPending ? (
          <Value>
            <Spinner size="25px" />
          </Value>
        ) : contract.isDeploying ? (
          <Value>
            <Spinner size="25px" /> Deploying...
          </Value>
        ) : (
          <ActionButtons>
            {isContractExpired() && (
              <ActionButton onClick={handleCancel(CLOSEOUT_TYPE.Close)}>
                Close
              </ActionButton>
            )}
            <ActionButton
              data-disabled={isClaimBtnDisabled()}
              data-rh={getClaimDisabledReason()}
              onClick={handleCancel(CLOSEOUT_TYPE.Claim)}
            >
              Claim Funds
            </ActionButton>
          </ActionButtons>
        ))}
    </Container>
  );
}

export default withContractsRowState(Row);
