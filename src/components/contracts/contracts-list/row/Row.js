import withContractsRowState from 'lumerin-wallet-ui-logic/src/hocs/withContractsRowState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import Details from './Details';
import Amount from './Amount';
import Icon from './Icon';
import { ClockIcon } from '../../../icons/ClockIcon';

const Container = styled.div`
  margin-left: 1.6rem;
  padding: 1.2rem 2.4rem 1.2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const Value = styled.label`
  color: black;
  font-size: 1rem;
  align-text: left;
`;

function Row({ contract }) {
  // TODO: Add better padding
  return (
    <Container>
      <Value>{contract.status}</Value>
      <ClockIcon fill={contract.status === 'Live' ? '#8C2AF5' : 'black'} />
      <Value>{contract.deviceName}</Value>
      <Value>{contract.hashrate}</Value>
    </Container>
  );
}

export default withContractsRowState(Row);
