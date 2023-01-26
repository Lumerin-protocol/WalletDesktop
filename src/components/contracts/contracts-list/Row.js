import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTimer } from 'react-timer-hook';

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
import { SmallAssetContainer } from './ContractsRow.styles';
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

const ActionButtons = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled(Btn)`
  font-size: 1.2rem;
  padding: 1rem;
  line-height: 1.5rem;
`;

const STATE_COLOR = {
  [CONTRACT_STATE.Running]: theme.colors.warning,
  [CONTRACT_STATE.Avaliable]: theme.colors.success
};

function Row({ contract, cancel, address, ratio, explorerUrl }) {
  // TODO: Add better padding
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
    });
  };

  const isCancelBtnDisabled = () => {
    return (
      contract.state !== CONTRACT_STATE.Avaliable || contract.balance !== '0'
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

  const contractEndTimestamp = getContractEndTimestamp(contract);
  const timer = useTimer({ expiryTimestamp: new Date(contractEndTimestamp) });

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
            {!isContractClosed(contract) && (
              <ActionButton
                disabled={isCancelBtnDisabled()}
                onClick={handleCancel(CLOSEOUT_TYPE.Close)}
              >
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
