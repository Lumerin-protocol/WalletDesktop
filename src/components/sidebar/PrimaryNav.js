import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FailedImportsBadge from './FailedImportsBadge';
import ConverterIcon from '../icons/ConverterIcon';
import AuctionIcon from '../icons/AuctionIcon';
import WalletIcon from '../icons/WalletIcon';
import PortIcon from '../icons/PortIcon';
import SocketIcon from '../icons/SocketIcon';
import ContractIcon from '../icons/ContractIcon';

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
    <React.Fragment>
      <Button
        onClick={() => setActiveIndex(0)}
        activeClassName="active"
        data-testid="wallets-nav-btn"
        to="/wallets"
      >
        <IconWrapper>
          <WalletIcon isActive={activeIndex === 0} size={iconSize} />
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
          <SocketIcon isActive={activeIndex === 1} size={iconSize} />
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
          <ContractIcon isActive={activeIndex === 2} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Contracts</Label>
      </Button>
    </React.Fragment>
  );
}
