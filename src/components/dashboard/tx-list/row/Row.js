import React from 'react';
import styled from 'styled-components';

import withTxRowState from '../../../../store/hocs/withTxRowState';
import Details from './Details';
import Amount from './Amount';
import { TxIcon } from './Icon';
import { LumerinDarkIcon } from '../../../icons/LumerinDarkIcon';
import { LumerinLightIcon } from '../../../icons/LumerinLightIcon';
import { EtherIcon } from '../../../icons/EtherIcon';

const Container = styled.div`
  margin-left: 1.6rem;
  padding: 1.2rem 2.4rem 1.2rem 0;
  display: grid;
  grid-template-columns: 5fr 5fr 5fr 20fr;
  align-items: center;
  box-shadow: 0 -1px 0 0 ${p => p.theme.colors.lightShade} inset;
  cursor: pointer;
  height: 66px;
`;

const IconContainer = styled.div`
  display: block;
  text-align: center;
  margin: 0 auto;
  flex-shrink: 0;
  width: 40px;
`;

const Row = ({ tx, explorerUrl }) => (
  <Container onClick={() => window.open(explorerUrl, '_blank')}>
    <IconContainer>
      {tx.symbol === 'LMR' ? (
        <LumerinLightIcon size="5rem" />
      ) : (
        <EtherIcon size="4rem"></EtherIcon>
      )}
    </IconContainer>
    <IconContainer>
      <TxIcon txType={tx.txType} />
    </IconContainer>
    <Amount {...tx} />
    <Details {...tx} />
  </Container>
);

export default withTxRowState(Row);
