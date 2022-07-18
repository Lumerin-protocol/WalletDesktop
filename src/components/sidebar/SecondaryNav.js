import React from 'react';

import { withClient } from '@lumerin/wallet-ui-logic/src/hocs/clientContext';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { BaseBtn } from '../common';
import ToolIcon from '../icons/ToolIcon';
import HelpIcon from '../icons/HelpIcon';
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

const HelpLink = styled.span`
  display: flex;
  min-height: 7.1rem;
  align-items: center;
  text-decoration: none;
  letter-spacing: 1.6px;
  color: ${p => p.theme.colors.darker};
  padding: 1.6rem;
  border-top: 1px solid transparent;
  cursor: pointer;

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

const iconSize = '3.2rem';

function SecondaryNav({
  parent,
  client: { onHelpLinkClick },
  activeIndex,
  setActiveIndex
}) {
  // static propTypes = {
  //   parent: PropTypes.object.isRequired,
  //   client: PropTypes.shape({
  //     onHelpLinkClick: PropTypes.func.isRequired
  //   }).isRequired
  // };

  return (
    <Container>
      <Button
        onClick={() => setActiveIndex(4)}
        activeClassName="active"
        data-testid="indicies-nav-btn"
        to="/indicies"
      >
        <IconWrapper>
          <CogIcon isActive={activeIndex === 4} size={iconSize} />
          {/* <ReportsNavIcon isActive={activeIndex === 4} size={iconSize} /> */}
        </IconWrapper>
        <Label parent={parent}>Indicies</Label>
      </Button>

      <Button
        onClick={() => setActiveIndex(5)}
        activeClassName="active"
        data-testid="tools-nav-btn"
        parent={parent}
        to="/tools"
      >
        <IconWrapper parent={parent}>
          <ToolIcon isActive={activeIndex === 5} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Tools</Label>
      </Button>
      <HelpLink data-testid="help-nav-btn" onClick={onHelpLinkClick}>
        <IconWrapper parent={parent}>
          <HelpIcon size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Help</Label>
      </HelpLink>
    </Container>
  );
}

export default withClient(SecondaryNav);
