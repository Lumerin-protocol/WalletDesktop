import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import withContractsRowState from '../../../store/hocs/withContractsRowState';

import { ClockIcon } from '../../icons/ClockIcon';
import { Btn } from '../../common';
import { CLOSEOUT_TYPE, CONTRACT_STATE } from '../../../enums';
import Spinner from '../../common/Spinner';
import { lmrEightDecimals } from '../../../store/utils/coinValue';
import theme from '../../../ui/theme';

const Container = styled.div`
  padding: 1.2rem 0;
  display: grid;
  grid-template-columns: 1fr 40px 1fr 1fr 1fr 2fr;
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

const SmallAssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
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

function Row({ contract, cancel, address }) {
  // TODO: Add better padding
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [contract]);

  const handleCancel = closeOutType => e => {
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

  const isContractClosed = () => {
    return contract.seller === contract.buyer;
  };

  const getClockColor = () => {
    const CLOSED_COLOR = theme.colors.dark;
    if (isContractClosed()) {
      return CLOSED_COLOR;
    }

    return STATE_COLOR[contract.state];
  };

  const getContractState = () => {
    if (isContractClosed()) {
      return 'Closed';
    }

    return Object.entries(CONTRACT_STATE).find(s => contract.state === s[1])[0];
  };

  const formatPrice = price => {
    return `${Number(price) / lmrEightDecimals} LMR`;
  };

  const formatSpeed = speed => {
    return Number(speed) / 10 ** 12;
  };

  const formatDuration = duration => {
    const numLength = parseFloat(duration / 3600);
    const days = Math.floor(numLength / 24);
    const remainder = numLength % 24;
    const hours = days >= 1 ? Math.floor(remainder) : Math.floor(numLength);
    const minutes =
      days >= 1
        ? Math.floor(60 * (remainder - hours))
        : Math.floor((numLength - Math.floor(numLength)) * 60);
    const seconds = Math.floor(duration % 60);
    const readableDays = days
      ? days === 1
        ? `${days} day`
        : `${days} days`
      : '';
    const readableHours = hours
      ? hours === 1
        ? `${hours} hour`
        : `${hours} hours`
      : '';
    const readableMinutes = minutes
      ? minutes === 1
        ? `${minutes} minute`
        : `${minutes} minutes`
      : '';
    const readableSeconds =
      !minutes && seconds
        ? seconds === 1
          ? `1 second`
          : `${seconds} seconds`
        : '';
    const readableDate = `${readableDays} ${readableHours} ${readableMinutes} ${readableSeconds}`.trim();
    return readableDate;
  };

  const formatTimestamp = timestamp => {
    if (+timestamp === 0) {
      return '';
    }
    return moment.unix(timestamp).format('L');
  };

  return (
    <Container>
      <Value>{formatTimestamp(contract.timestamp)}</Value>
      <SmallAssetContainer data-rh={getContractState()}>
        <ClockIcon size="3rem" fill={getClockColor()} />
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
            {!isContractClosed() && (
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
