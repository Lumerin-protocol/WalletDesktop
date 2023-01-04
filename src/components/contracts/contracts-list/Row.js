import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  getContractState
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

  const isClaimBtnDisabled = () => {
    return contract.balance === '0';
  };

  const getClockColor = contract => {
    const CLOSED_COLOR = theme.colors.dark;
    if (isContractClosed(contract)) {
      return CLOSED_COLOR;
    }

    return STATE_COLOR[contract.state];
  };

  return (
    <Container ratio={ratio} onClick={() => window.open(explorerUrl, '_blank')}>
      <Value>{formatTimestamp(contract.timestamp)}</Value>
      <SmallAssetContainer data-rh={getContractState(contract)}>
        <ClockIcon size="3rem" fill={getClockColor(contract)} />
      </SmallAssetContainer>
      <Value>{formatPrice(contract.price)}</Value>
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
              disabled={isClaimBtnDisabled()}
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
