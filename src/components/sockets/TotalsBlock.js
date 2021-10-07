import withContractTotalsBlockState from 'lumerin-wallet-ui-logic/src/hocs/withContractTotalsBlockState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { BaseBtn, Btn, DisplayValue } from '../common';

const convertLmrToEth = () => {};

const relSize = ratio => `calc(100vw / ${ratio})`;

const Container = styled.div`
  margin: 1.6rem 0 1.6rem;
  width: 70%;
  height: 100px;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
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
  padding: 0.75rem 3rem;
  border-radius: 5px;
  @media (min-width: 1040px) {
  }
`;

const CoinSymbol = styled.div`
  border-radius: 14.1px;
  background-color: ${p => p.theme.colors.primary};
  width: 4rem;
  line-height: 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  @media (min-width: 1040px) {
    line-height: 3.2rem;
    width: 6.3rem;
    font-size: 2rem;
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

function TotalsBlock(props) {
  // static propTypes = {
  //   coinBalanceUSD: PropTypes.string.isRequired,
  //   coinBalanceWei: PropTypes.string.isRequired,
  //   lmrBalanceWei: PropTypes.string.isRequired,
  //   coinSymbol: PropTypes.string.isRequired
  // };

  return (
    <>
      <Container>
        <Total>
          <TotalLabel>My Miners</TotalLabel>
          <TotalSubLabel>Incoming Connections</TotalSubLabel>
          <TotalValue>{530}</TotalValue>
        </Total>
        <Total>
          <TotalLabel>Active</TotalLabel>
          <TotalSubLabel>Contracts</TotalSubLabel>
          <TotalValue>{500}</TotalValue>
        </Total>
        <Total>
          <TotalLabel>Draft</TotalLabel>
          <TotalSubLabel>Contracts</TotalSubLabel>
          <TotalValue>{30}</TotalValue>
        </Total>
      </Container>
    </>
  );
}

export default withContractTotalsBlockState(TotalsBlock);
