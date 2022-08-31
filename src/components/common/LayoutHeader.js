import React from 'react';
import { AddressHeader } from './AddressHeader';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  width: 100%;
  z-index: 2;
  right: 0;
  left: 0;
  top: 0;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Title = styled.label`
  font-size: 2.4rem;
  line-height: 3rem;
  white-space: nowrap;
  margin: 0;
  font-weight: 600;
  color: ${p => p.theme.colors.dark}
  margin-bottom: 4.8px;
  margin-right: 2.4rem;
  cursor: default;

  @media (min-width: 1140px) {
  }

  @media (min-width: 1200px) {
  }
`;

export const LayoutHeader = ({ title, address, copyToClipboard, children }) => (
  <>
    <Container>
      <TitleRow>
        <Title>{title}</Title>
        {children}
      </TitleRow>

      <AddressHeader address={address} copyToClipboard={copyToClipboard} />
    </Container>
  </>
);
