import React from 'react';
import styled from 'styled-components';

const calcWidth = n => 100 / n;

const Container = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
`;

const Tab = styled.button`
  width: ${calcWidth(4)}%;
  font: inherit;
  line-height: 1.2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${p => p.theme.colors.dark}
  letter-spacing: 1.4px;
  text-align: center;
  opacity: ${p => (p.isActive ? '1' : '0.75')};
  padding: 1.6rem 1rem;
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
    width: ${calcWidth(4)}%;
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
        Timestamp
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
        Duration (Days)
      </Tab>
      <Tab
        isActive={activeFilter === 'speed'}
        // onClick={() => onFilterChange('speed')}
      >
        Speed (TH/s)
      </Tab>
    </Container>
  );
}
