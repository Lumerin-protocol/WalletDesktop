import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import ScanIndicator from './ScanIndicator';
import { Flex } from '../../common';
import Filter from './Filter';

// const responsiveHeader = width => css`
//   @media (min-width: ${width}) {
//     align-items: baseline;
//     display: flex;
//     top: 6.8rem;
//   }
// `;

const Container = styled.div`
  position: sticky;
  border-radius: 5px;
  top: 4.1rem;
  left: 0;
  right: 0;
  z-index: 1;

  padding: 1.2rem 2.4rem 1.2rem 2.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function Header({
  onFilterChange,
  activeFilter,
  isMultiChain,
  syncStatus
}) {
  return (
    <>
      <Container>
        <Filter
          onFilterChange={onFilterChange}
          isMultiChain={isMultiChain}
          activeFilter={activeFilter}
        />
      </Container>
    </>
  );
}
