import React from 'react';
import { uniqueId } from 'lodash';
import styled from 'styled-components';
import {
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconArrowsSort
} from '@tabler/icons';

const Container = styled.div`
  display: grid;
  grid-template-columns: ${p => p.ratio.map(x => `${x}`).join(' ')};
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
  opacity: ${p => (p.isActive ? '1' : '1')};
  padding: 1.6rem 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${p => (p.isActive ? 'white' : 'transparent')};
  margin-bottom: 1px;
  transition: 0.3s;
  cursor: ${p => (p.sortable ? 'pointer' : 'auto')};

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: ${p => (p.sortable ? '1' : '0.75')};
  }

  @media (min-width: 800px) {
    font-size: 1.4rem;
  }
`;

const Select = styled.select`
  outline: 0;
  border: 0px;
  letter-spacing: 1.4px;
  line-height: 1.2rem;
  font-size: 1.2rem;
  background: transparent;
  border-radius: 15px;
  font-weight: bold;
  font: inherit;
  color: ${p => p.theme.colors.primary};
`;

export default function Filter({
  onSortChange,
  activeSort,
  tabs,
  onColumnOptionChange
}) {
  const iconStyles = {
    marginLeft: '3px',
    width: '12px',
    height: '12px',
    color: '#0E4353',
    fill: '#0E4353'
  };

  const selectedTab = t => {
    return (
      <Tab key={t.value || uniqueId()}>
        <Select
          name={t.name}
          onChange={e => {
            onColumnOptionChange({
              value: e.target.value,
              type: t.value
            });
          }}
        >
          {t.options.map(o => (
            <option key={o.value} value={o.value} selected={o.selected}>
              {o.label}
            </option>
          ))}
        </Select>
      </Tab>
    );
  };

  const onSortChangeHandler = value => {
    if (activeSort?.value === value && activeSort?.direction === 'desc') {
      onSortChange(null);
      return;
    }
    if (activeSort?.value === value && activeSort?.direction === 'asc') {
      onSortChange({ value, direction: 'desc' });
      return;
    }
    onSortChange({ value, direction: 'asc' });
  };

  return (
    <Container ratio={tabs.map(x => x.ratio)}>
      {tabs &&
        tabs.map(t =>
          t.options ? (
            selectedTab(t)
          ) : (
            <Tab
              sortable={t.sortable}
              onClick={() => t.sortable && onSortChangeHandler(t.value)}
              key={t.value || uniqueId()}
              isActive={activeSort && activeSort?.value === t.value}
            >
              {t.name}
              {activeSort && activeSort?.value === t.value ? (
                activeSort.direction === 'asc' ? (
                  <IconArrowNarrowUp style={iconStyles}></IconArrowNarrowUp>
                ) : (
                  <IconArrowNarrowDown style={iconStyles}></IconArrowNarrowDown>
                )
              ) : t.sortable ? (
                <IconArrowsSort style={iconStyles}></IconArrowsSort>
              ) : null}
            </Tab>
          )
        )}
    </Container>
  );
}
