import React, { useState } from 'react';
import styled from 'styled-components';

import SecondaryNav from './SecondaryNav';
import PrimaryNav from './PrimaryNav';
import { SidebarLumerinLightIcon } from '../icons/SidebarLumerinLightIcon';

import { ReactComponent as LumerinLogoFull } from '../icons/LumerinLogoFull.svg';

const Container = styled.div`
  background: ${p => p.theme.colors.light};
  width: 7rem;
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
  position: absolute;
  overflow-y: hidden;
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
  padding: 4rem 2.2rem 2.8rem 2.2rem;
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

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  padding-left: 2.2rem;
`;

const PrimaryNavContainer = styled.nav`
  flex-grow: 1;
  margin-top: 3rem;
`;

export default function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Container>
      <FullLogoContainer parent={Container}>
        <LumerinLogoFull height="45px" />
      </FullLogoContainer>

      <IconLogoContainer parent={Container}>
        <SidebarLumerinLightIcon size="6rem" />
      </IconLogoContainer>

      <NavContainer>
        <PrimaryNavContainer>
          <PrimaryNav
            parent={Container}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </PrimaryNavContainer>

        <nav>
          <SecondaryNav
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            parent={Container}
          />
        </nav>
      </NavContainer>
    </Container>
  );
}
