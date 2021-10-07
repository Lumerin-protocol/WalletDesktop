import React, { useState } from 'react';
import { withClient } from 'lumerin-wallet-ui-logic/src/hocs/clientContext';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { BaseBtn } from '../common';
import ToolIcon from '../icons/ToolIcon';
import CogIcon from '../icons/CogIcon';
import HelpIcon from '../icons/HelpIcon';

const IconContainer = styled.div`
  padding: 1.2rem 0 1.6rem 1.9rem;
  display: block;

  @media (min-height: 650px) {
    padding-top: 5.2rem;
  }

  @media (min-width: 800px) {
    display: none;
  }

  & svg {
    opacity: 0.5;
    transition: transform 0.3s;
    transform: rotate(0deg);
    transform-origin: center center;
  }

  ${({ parent }) => parent}:hover & svg {
    opacity: 1;
    transform: rotate(-90deg);
  }
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
  // cursor: pointer;
  // display: block;
  // text-decoration: none;
  // color: ${p => p.theme.colors.dark};
  // padding: 1.6rem;
  // line-height: 2rem;
  // opacity: 0;
  // transition: all 600ms, opacity 200ms, transform 800ms;
  // position: relative;

  // &[disabled] {
  //   pointer-events: none;
  // }

  // &:focus {
  //   outline: none;
  // }

  // &.active {
  //   pointer-events: none;
  //   padding-left: 3.2rem;
  // }

  // &:before {
  //   transition: 0.4s;
  //   transition-delay: 0.2s;
  //   opacity: 0;
  //   content: '';
  //   display: block;
  //   background-color: ${p => p.theme.colors.primary};
  //   border-radius: 100%;
  //   position: absolute;
  //   top: 50%;
  //   margin-top: -2px;
  //   left: 1.6rem;
  // }

  // &.active:before {
  //   opacity: 1;
  //   width: 8px;
  //   height: 8px;
  // }

  // &:nth-child(1) {
  //   transform: translateY(9.6rem);
  // }

  // &:nth-child(2) {
  //   transform: translateY(4rem);
  // }

  // ${({ parent }) => parent}:hover & {
  //   transform: translateY(0);
  //   opacity: 0.5;
  //   transition: all 600ms, opacity 400ms, transform 400ms;
  //   transition-delay: 0s, 100ms, 0s;

  //   &:active,
  //   &:hover,
  //   &:focus,
  //   &.active {
  //     opacity: 1;
  //   }
  // }

  // @media (min-width: 800px) {
  //   ${({ parent }) => parent} & {
  //     transform: translateY(0);
  //   }

  //   opacity: 0.5;

  //   &:active,
  //   &:hover,
  //   &:focus,
  //   &.active {
  //     opacity: 1;
  //   }
  // }
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
const iconSize = '2.4rem';

function SecondaryNav({ parent, client, activeIndex, setActiveIndex }) {
  // static propTypes = {
  //   parent: PropTypes.object.isRequired,
  //   client: PropTypes.shape({
  //     onHelpLinkClick: PropTypes.func.isRequired
  //   }).isRequired
  // };

  return (
    <>
      <Button
        onClick={() => setActiveIndex(3)}
        activeClassName="active"
        data-testid="tools-nav-btn"
        parent={parent}
        to="/tools"
      >
        <IconWrapper parent={parent}>
          <ToolIcon isActive={activeIndex === 3} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Tools</Label>
      </Button>
      <Button
        onClick={() => setActiveIndex(4)}
        activeClassName="active"
        data-testid="help-nav-btn"
        onClick={client.onHelpLinkClick}
        parent={parent}
        as={BaseBtn}
      >
        <IconWrapper parent={parent}>
          <HelpIcon isActive={activeIndex === 4} size={iconSize} />
        </IconWrapper>
        <Label parent={parent}>Help</Label>
      </Button>
    </>
  );
}

export default withClient(SecondaryNav);
