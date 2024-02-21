import React, { useState } from 'react';
import styled from 'styled-components';
import { Btn } from '../../common';
import { IconArrowNarrowRight } from '@tabler/icons';
import { withRouter } from 'react-router-dom';

const Container = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr;
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

const BultUpdateBtn = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;

  :hover {
    opacity: 0.8;
  }
`;

const SelectedHeader = props => {
  const [checked, setChecked] = useState(false);
  return (
    <Container>
      <Tab>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <input
            style={{ marginRight: '10px', width: '16px', height: '16px' }}
            data-testid={`selector-all`}
            onChange={() => {
              setChecked(!checked);
              props.onSelectAll(!checked);
            }}
            checked={checked}
            type="checkbox"
            id={`selector-all`}
          />
        </div>
      </Tab>
      <Tab style={{ justifyContent: 'space-between' }}>
        <div>Select All</div>
        <div
          style={{
            width: '40%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          <div>{props.selectedItems?.length} contracts selected</div>
          <BultUpdateBtn onClick={() => props.history.push('/bulk-update')}>
            <span> Bulk Update</span>
            <IconArrowNarrowRight></IconArrowNarrowRight>
          </BultUpdateBtn>
        </div>
      </Tab>
    </Container>
  );
};

export default withRouter(SelectedHeader);
