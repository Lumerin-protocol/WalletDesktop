import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

const Container = styled.div`
  display: flex;
  justify-content: start;
`;

const Tab = styled.button`
  font: inherit;
  line-height: 1.2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${p => p.theme.colors.dark}
  letter-spacing: 1px;
  text-align: center;
  opacity: ${p => (p.isActive ? '1' : '0.5')};
  padding: 1.6rem 0.8rem;
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid ${p => (p.isActive ? 'white' : 'transparent')};
  margin: 0 2rem 1px 0;
  transition: 0.3s;

  &:focus {
    outline: none;
  }

  @media (min-width: 880px) {
    line-height: 1.4rem;
    font-size: 1.4rem;
    padding: 1.6rem 1.4rem;
  }
`;

export default class Filter extends React.Component {
  // static propTypes = {
  //   onFilterChange: PropTypes.func.isRequired,
  //   isMultiChain: PropTypes.bool.isRequired,
  //   activeFilter: PropTypes.oneOf([
  //     'converted',
  //     'received',
  //     'auction',
  //     'ported',
  //     'sent',
  //     ''
  //   ]).isRequired
  // }

  render() {
    return (
      <Container>
        <Tab
          isActive={this.props.activeFilter === 'ipAddress'}
          onClick={() => this.props.onFilterChange('ipAddress')}
        >
          IP Address
        </Tab>
        <Tab
          isActive={this.props.activeFilter === 'status'}
          onClick={() => this.props.onFilterChange('status')}
        >
          Status
        </Tab>
        <Tab
          isActive={this.props.activeFilter === 'socketAddress'}
          onClick={() => this.props.onFilterChange('socketAddress')}
        >
          Socket
        </Tab>
        <Tab
          isActive={this.props.activeFilter === 'total'}
          onClick={() => this.props.onFilterChange('totalShares')}
        >
          Total
        </Tab>
        <Tab
          isActive={this.props.activeFilter === 'accepted'}
          onClick={() => this.props.onFilterChange('accepted')}
        >
          Accepted
        </Tab>
        <Tab
          isActive={this.props.activeFilter === 'rejected'}
          onClick={() => this.props.onFilterChange('rejected')}
        >
          Rejected
        </Tab>
      </Container>
    );
  }
}
