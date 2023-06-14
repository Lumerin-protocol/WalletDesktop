import React from 'react';
import styled from 'styled-components';
import { uniqueId } from 'lodash';

const Container = styled.div`
  display: grid;
  grid-template-columns: ${p => p.ratio.map(x => `${x}fr`).join(' ')};
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

export default function Filter({ onFilterChange, activeFilter, tabs }) {
  return (
    <Container ratio={tabs.map(x => x.ratio)}>
      {tabs &&
        tabs.map(t => (
          <Tab key={t.value || uniqueId()} isActive={activeFilter === t.value}>
            {t.name}
          </Tab>
        ))}
    </Container>
  );
}
