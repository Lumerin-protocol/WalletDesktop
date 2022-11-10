import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px 1fr 1fr 1fr 2fr;
  width: 100%;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font: inherit;
  line-height: 1.2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${p => p.theme.colors.primary};
  letter-spacing: 1.4px;
  text-align: center;
  opacity: ${p => (p.isActive ? '1' : '0.75')};
  padding: 1.6rem 0;
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid ${p => (p.isActive ? 'white' : 'transparent')};
  margin-bottom: 1px;
  transition: 0.3s;

  &:focus {
    outline: none;
  }

  @media (min-width: 800px) {
    font-size: 1.4rem;
  }
`;

const Spacer = styled.div`
  width: 40px;
`;

export default function Filter({ onFilterChange, activeFilter }) {
  // static propTypes = {
  //   onFilterChange: PropTypes.func.isRequired,
  //   activeFilter: PropTypes.oneOf([
  //     'received',
  //     'sent',
  //     ''
  //   ]).isRequired
  // }

  return (
    <Container>
      <Tab
        isActive={activeFilter === 'timestamp'}
        // onClick={() => onFilterChange('timestamp')}
      >
        Started
      </Tab>
      <Spacer />
      <Tab
        isActive={activeFilter === 'price'}
        // onClick={() => onFilterChange('price')}
      >
        Price
      </Tab>
      <Tab
        isActive={activeFilter === 'length'}
        // onClick={() => onFilterChange('length')}
      >
        Duration
      </Tab>
      <Tab
        isActive={activeFilter === 'speed'}
        // onClick={() => onFilterChange('speed')}
      >
        Speed (TH/s)
      </Tab>
      <Tab>Actions</Tab>
    </Container>
  );
}
