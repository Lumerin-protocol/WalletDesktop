import React from 'react';
import styled from 'styled-components';

import withTxRowState from '@lumerin/wallet-ui-logic/src/hocs/withTxRowState';
import Details from './Details';
import Amount from './Amount';
import { TxIcon } from './Icon';
import { LumerinDarkIcon } from '../../../icons/LumerinDarkIcon';

const Container = styled.div`
  margin-left: 1.6rem;
  padding: 1.2rem 2.4rem 1.2rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const IconLogoContainer = styled.div`
  padding: 2.4rem 1.2rem;
  height: 100px;
  width: 100px
  display: block;
  flex-shrink: 0;
`;

const Row = ({ tx }) => (
  <Container>
    <IconLogoContainer>
      <LumerinDarkIcon size="3rem" />
    </IconLogoContainer>
    <TxIcon type={tx.txType} />
    <div>
      <Amount />
      <Details />
    </div>
  </Container>
);

export default withTxRowState(Row);
