import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import styled from 'styled-components';
import withContractsRowState from '../../../store/hocs/withContractsRowState';
import { ClockIcon } from '../../icons/ClockIcon';
import { CLOSEOUT_TYPE, CONTRACT_STATE } from '../../../enums';
import Spinner from '../../common/Spinner';
import theme from '../../../ui/theme';
import {
  formatDuration,
  formatSpeed,
  formatTimestamp,
  formatPrice,
  getContractState,
  isContractClosed,
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

const STATE_COLOR = {
  [CONTRACT_STATE.Running]: theme.colors.warning,
  [CONTRACT_STATE.Avaliable]: theme.colors.success
};

function BuyerHubRow({ contract, ratio, explorerUrl }) {
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [contract]);

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
      {contract.inProgress ? (
        <Value>
          <Spinner size="25px" /> Purchasing..
        </Value>
      ) : (
        <SmallAssetContainer data-rh={getContractState(contract)}>
          <ClockIcon size="3rem" fill={getClockColor(contract)} />
        </SmallAssetContainer>
      )}

      <Value>{formatPrice(contract.price)}</Value>
      <Value>{formatDuration(contract.length)}</Value>
      <Value>{formatSpeed(contract.speed)}</Value>
    </Container>
  );
}

export default withContractsRowState(BuyerHubRow);
