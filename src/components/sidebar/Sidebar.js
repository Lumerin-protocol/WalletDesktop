import React, { useState } from 'react';
import styled from 'styled-components';

import SecondaryNav from './SecondaryNav';
import PrimaryNav from './PrimaryNav';
import Logo from './Logo';
import { LumerinLightIcon } from '../icons/LumerinLightIcon';

const Container = styled.div`
  background: ${p => p.theme.colors.light};
  width: 7rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 3;
  &:hover {
    width: 210px;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  }
  @media (min-width: 800px) {
    position: relative;
    width: 210px;
    &:hover {
      box-shadow: none;
    }
  }
`;

const FullLogoContainer = styled.div`
  padding: 2.2rem 2.2rem 2.8rem 2.2rem;
  height: 100px;
  display: none;
  flex-shrink: 0;

  ${({ parent }) => parent}:hover & {
    display: block;
  }
  @media (min-width: 800px) {
    display: block;
  }
`;

const IconLogoContainer = styled.div`
  padding: 2rem 0.8rem;
  height: 100px;
  display: block;
  flex-shrink: 0;

  ${({ parent }) => parent}:hover & {
    display: none;
  }
  @media (min-width: 800px) {
    display: none;
  }
`;

const PrimaryNavContainer = styled.nav`
  flex-grow: 1;
  margin-top: 3rem;
`;

const SecondaryNavContainer = styled.nav`
  padding-bottom: 1.2rem;
`;

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Container>
      <FullLogoContainer parent={Container}>
        <Logo />
      </FullLogoContainer>

      <IconLogoContainer parent={Container}>
        <LumerinLightIcon size="6rem" />
      </IconLogoContainer>

      <PrimaryNavContainer>
        <PrimaryNav
          parent={Container}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      </PrimaryNavContainer>

      <SecondaryNavContainer>
        <SecondaryNav
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          parent={Container}
        />
      </SecondaryNavContainer>
    </Container>
  );
}
