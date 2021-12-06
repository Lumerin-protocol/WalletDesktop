import React from 'react';
import styled from 'styled-components';
import withContractsRowState from '@lumerin/wallet-ui-logic/src/hocs/withContractsRowState';

import { ClockIcon } from '../../icons/ClockIcon';

const calcWidth = n => 100 / n;

const Container = styled.div`
  padding: 1.2rem 0;
  display: flex;
  text-align: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Value = styled.label`
  display: flex;
  padding: 0 3rem;
  flex-direction: column;
  justify-content: center;
  width: ${calcWidth(4)}%;
  color: black;
  font-size: 1.2rem;
`;

const SmallAssetContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

function Row({ contract }) {
  // TODO: Add better padding
  return (
    <Container>
      <Value>{contract.status}</Value>
      <SmallAssetContainer>
        <ClockIcon
          size="3rem"
          fill={contract.status === 'Live' ? '#8C2AF5' : 'black'}
        />
      </SmallAssetContainer>
      <Value>{contract.deviceName}</Value>
      <Value>{contract.hashrate}</Value>
    </Container>
  );
}

export default withContractsRowState(Row);
