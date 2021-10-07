import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import ScanIndicator from './ScanIndicator';
import { Flex } from '../../common';
import Filter from './Filter';

const responsiveHeader = width => css`
  @media (min-width: ${width}) {
    align-items: baseline;
    display: flex;
    top: 6.8rem;
  }
`;

const Container = styled.div`
  position: sticky;
  border-radius: 5px;
  top: 4.1rem;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 0 2.4rem;

  ${p => responsiveHeader(p.isMultiChain ? '1140px' : '1040px')}
`;

export default class Header extends React.Component {
  static propTypes = {
    hasTransactions: PropTypes.bool.isRequired,
    onWalletRefresh: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    activeFilter: PropTypes.string.isRequired,
    isMultiChain: PropTypes.bool.isRequired,
    syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed']).isRequired
  };

  render() {
    return (
      <>
        {/* <Flex.Row grow="1">
        <Title onClick={this.props.onTitleClick}>Transactions</Title>
      </Flex.Row> */}
        <Container isMultiChain={this.props.isMultiChain}>
          <Filter
            onFilterChange={this.props.onFilterChange}
            isMultiChain={this.props.isMultiChain}
            activeFilter={this.props.activeFilter}
          />
        </Container>
      </>
    );
  }
}
