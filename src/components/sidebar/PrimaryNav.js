import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { WalletNavIcon } from '../icons/WalletNavIcon';
import { SocketNavIcon } from '../icons/SocketNavIcon';
import { ContractNavIcon } from '../icons/ContractNavIcon';
import CogIcon from '../icons/CogIcon';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-height: 10%;
`;

const Button = styled(NavLink)`
  display: flex;
  min-height: 7.1rem;
  align-items: center;
  text-decoration: none;
  letter-spacing: 1.6px;
  // text-transform: uppercase;
  color: ${p => p.theme.colors.darker};
  padding: 1.6rem;
  border-top: 1px solid transparent;

  &:focus {
    outline: none;
  }

  &.active {
    color: ${p => p.theme.colors.primary};
    pointer-events: none;
  }
`;

const IconWrapper = styled.div`
  margin-right: 1.6rem;
  margin-left: 0.3rem;
  opacity: 0.5;

  ${Button}.active & {
    opacity: 1;
  }
`;

const Label = styled.span`
  opacity: 0;
  flex-grow: 1;

  ${({ parent }) => parent}:hover & {
    opacity: 0.5;
  }

  ${({ parent }) => parent}:hover ${Button}.active & {
    opacity: 1;
  }

  @media (min-width: 800px) {
    opacity: 0.5;

    ${Button}.active & {
      opacity: 1;
    }
  }
`;

const iconSize = '3.6rem';

export default function PrimaryNav({ parent, activeIndex, setActiveIndex }) {
  return (
    <Container>
      <Button
        onClick={() => setActiveIndex(0)}
        activeClassName="active"
        data-testid="wallet-nav-btn"
        to="/wallet"
      >
        <IconWrapper>
          <WalletNavIcon isActive={activeIndex === 0} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Wallet</Label>
      </Button>

      <Button
        onClick={() => setActiveIndex(1)}
        activeClassName="active"
        data-testid="auction-nav-btn"
        to="/sockets"
      >
        <IconWrapper>
          <SocketNavIcon isActive={activeIndex === 1} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Sockets</Label>
      </Button>

      <Button
        onClick={() => setActiveIndex(2)}
        activeClassName="active"
        data-testid="auction-nav-btn"
        to="/contracts"
      >
        <IconWrapper>
          <ContractNavIcon isActive={activeIndex === 2} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Contracts</Label>
      </Button>

      {/* <Button
        onClick={() => setActiveIndex(3)}
        activeClassName="active"
        data-testid="auction-nav-btn"
        to="/reports"
      >
        <IconWrapper>
          <CogIcon isActive={activeIndex === 3} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Reports</Label>
      </Button> */}
    </Container>
  );
}
