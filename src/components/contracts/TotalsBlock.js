import React, { useState } from 'react';
import withContractTotalsBlockState from 'lumerin-wallet-ui-logic/src/hocs/withSocketTotalsBlockState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DraftIcon from '../icons/DraftIcon';

import { BaseBtn, Btn, DisplayValue } from '../common';

const convertLmrToEth = () => {};

const relSize = ratio => `calc(100vw / ${ratio})`;

const Container = styled.div`
  margin: 1.6rem 0 1.6rem;
  width: 80%;
  height: 100px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  @media (min-width: 1040px) {
  }
`;

const Total = styled.div`
  background-color: ${p => p.theme.colors.xLight};
  display: flex;
  flex-direction: column;
  height: 95%;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  border-radius: 5px;
  @media (min-width: 1040px) {
  }
`;

const TotalRow = styled.div`
  display: flex;
  width: 100%;
  height: 30%;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  @media (min-width: 1040px) {
    padding: 0.95em 0;
  }
`;

const TotalLabel = styled.div`
  display: block;
  line-height: 1.5;
  font-weight: 600;
  color: ${p => p.theme.colors.dark}
  white-space: nowrap;
  position: relative;
  top: ${relSize(-400)};
  font-size: ${relSize(76)};

  @media (min-width: 800px) {
    font-size: ${relSize(68)};
  }

  @media (min-width: 1440px) {
    font-size: 2.2rem;
  }
`;

const TotalSubLabel = styled.div`
  display: block;
  line-height: 1.0;
  font-weight: 400;
  color: ${p => p.theme.colors.dark}
  white-space: nowrap;
  position: relative;
  top: ${relSize(-400)};
  font-size: ${relSize(82)};

  @media (min-width: 800px) {
    font-size: ${relSize(82)};
  }

  @media (min-width: 1440px) {
    font-size: 2.2rem;
  }
`;

const TotalValue = styled.div`
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: ${p => (p.large ? '-1px' : 'inherit')};
  color: ${p => p.theme.colors.darker}
  margin: .6rem 0;
  flex-grow: 1;
  position: relative;
  top: ${relSize(-400)};
  font-size: ${relSize(32)};

  @media (min-width: 800px) {
    font-size: ${relSize(44)};
  }

  @media (min-width: 1040px) {
    font-size: ${({ large }) => relSize(large ? 40 : 52)};
  }

  @media (min-width: 1440px) {
    font-size: ${({ large }) => (large ? '3.6rem' : '2.8rem')};
  }
`;

const ContractBtn = styled(BaseBtn)`
  width: 25%;
  height: 50%;
  font-size: 1rem;

  margin-right: 2.6rem;
  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.light}
  color: ${p => p.theme.colors.primary}

  @media (min-width: 1040px) {
    margin-left: 0;
  }
`;

function TotalsBlock({ onOpenModal }) {
  // static propTypes = {
  //   coinBalanceUSD: PropTypes.string.isRequired,
  //   coinBalanceWei: PropTypes.string.isRequired,
  //   lmrBalanceWei: PropTypes.string.isRequired,
  //   coinSymbol: PropTypes.string.isRequired
  // };

  return (
    <Container>
      <ContractBtn onClick={() => onOpenModal()}>
        Create New Contract
      </ContractBtn>
      <Total>
        <TotalRow>
          <TotalLabel>Lumerin Pool</TotalLabel>
          <DraftIcon size="3.4rem" fill="black" />
        </TotalRow>
        <TotalSubLabel>Default Outgoing</TotalSubLabel>
        <TotalValue>{500}</TotalValue>
      </Total>
      <Total>
        <TotalRow>
          <TotalLabel>Alternative Pool</TotalLabel>
          <DraftIcon size="3.4rem" fill="black" />
        </TotalRow>
        <TotalSubLabel>Routed</TotalSubLabel>
        <TotalValue>{30}</TotalValue>
      </Total>
    </Container>
  );
}

export default withContractTotalsBlockState(TotalsBlock);
