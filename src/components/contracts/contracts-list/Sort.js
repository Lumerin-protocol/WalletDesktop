import React from 'react';
import { IconRefresh, IconSearch } from '@tabler/icons';
import styled from 'styled-components';
import Select from 'react-select';

const Container = styled.div`
  /* margin: 10px 0; */
  margin-left: -10px;
  width: fit-content;
  color: ${p => p.theme.colors.primary};
  font-weight: bold;
  display: flex;
  align-self: end;
  align-items: center;
`;

const rangeSelectOptions = [
  {
    label: 'None',
    value: null
  },
  {
    label: 'Price: Low to High',
    value: 'AscPrice'
  },
  {
    label: 'Price: High to Low',
    value: 'DescPrice'
  },
  {
    label: 'Duration: Short to Long',
    value: 'AscDuration'
  },
  {
    label: 'Duration: Long to Short',
    value: 'DescDuration'
  },
  {
    label: 'Speed: Slow to Fast',
    value: 'AscSpeed'
  },
  {
    label: 'Speed: Fast to Slow',
    value: 'DescSpeed'
  },
  {
    label: 'State: Available First',
    value: 'AvailableFirst'
  },
  {
    label: 'State: Running First',
    value: 'RunningFirst'
  }
];

export default function Sort(props) {
  return (
    <>
      <Container>
        <Select
          className="sorting"
          classNamePrefix="select"
          name="sorting"
          styles={{
            control: (base, state) => ({
              ...base,
              width: 'fit-content',
              minWidth: '150px',
              textAlign: 'right',
              cursor: 'pointer',
              color: '#0E4353',
              border: state.isFocused ? 0 : 0,
              boxShadow: state.isFocused ? 0 : 0,
              '&:hover': {
                border: state.isFocused ? 0 : 0
              },
              borderColor: state.isFocused ? '#0E4353' : undefined,
              background: 'transparent'
            }),
            placeholder: base => ({ ...base, color: '#0E4353' }),
            singleValue: base => ({ ...base, color: '#0E4353' }),
            indicatorsContainer: base => ({ ...base, color: '#0E4353' }),
            indicatorSeparator: base => ({ ...base, display: 'none' }),
            dropdownIndicator: base => ({ ...base, color: '#0E4353' }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? '#0E4353' : undefined,
              fontSize: '1.2rem',
              color: state.isSelected ? '#FFFFFF' : undefined,
              ':active': {
                ...base[':active'],
                backgroundColor: '#0E435380',
                color: '#FFFFFF'
              }
            })
          }}
          onChange={e => (e.value ? props.setSort(e) : props.setSort(null))}
          isSearchable={false}
          placeholder="Sort By:"
          value={props.sort}
          options={rangeSelectOptions}
        />
      </Container>
    </>
  );
}
