import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import theme from 'lumerin-wallet-ui-logic/src/theme';
import React from 'react';

import CloseIcon from '../icons/CloseIcon';

const Container = styled(ReactModal)`
  &.ReactModal__Content {
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
    will-change: transform, opacity;
    transform: translate3d(-50%, 10%, 0);
  }
  &.ReactModal__Content--after-open {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
    transform: translate3d(-50%, -10%, 0);
  }
`;

const Header = styled.header`
  padding: 1.6rem;
  display: flex;
  background-color: ${p =>
    p.variant === 'primary' ? p.theme.colors.primary : 'transparent'};
  justify-content: ${p => (p.hasTitle ? 'space-between' : 'flex-end')};
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  line-height: 2.4rem;
  font-weight: normal;
  color: ${p =>
    p.variant === 'primary' ? p.theme.colors.light : p.theme.colors.copy};
  margin: 0;
  flex-grow: 1;
  cursor: default;
`;

export const HeaderButton = styled.button`
  margin-left: 2rem;
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
  cursor: pointer;
  color: ${p =>
    p.variant === 'primary' ? p.theme.colors.light : p.theme.colors.primary};

  &[disabled] {
    color: ${p => p.theme.colors.weak};
  }

  &:not([disabled]):hover,
  &:hover {
    opacity: 0.5;
  }
`;

export default class Modal extends React.Component {
  // static propTypes = {
  //   onRequestClose: PropTypes.func.isRequired,
  //   headerChildren: PropTypes.node,
  //   children: PropTypes.node.isRequired,
  //   variant: PropTypes.oneOf(['primary']),
  //   isOpen: PropTypes.bool.isRequired,
  //   title: PropTypes.string,
  //   styleOverrides: PropTypes.object
  // };

  render() {
    const {
      onRequestClose,
      styleOverrides,
      headerChildren,
      children,
      variant,
      isOpen,
      title,
      ...other
    } = this.props;

    return (
      <Container
        onRequestClose={onRequestClose}
        closeTimeoutMS={600}
        contentLabel="Modal"
        isOpen={isOpen}
        style={{
          overlay: {
            backgroundColor: 'transparent',
            zIndex: '3'
          },
          content: {
            background: theme.colors.light,
            flexDirection: 'column',
            marginBottom: '1.6rem',
            borderRadius: '0',
            boxShadow: `0 0 16px 0 ${theme.colors.darkShade}`,
            overflowY: 'auto',
            position: 'absolute',
            outline: 'none',
            display: 'flex',
            padding: '0',
            border: 'none',
            width: '420px',
            right: 'auto',
            left: '50%',
            top: '10rem',
            ...styleOverrides
          }
        }}
        {...other}
      >
        <Header hasTitle={!!title} variant={variant}>
          {title && <Title variant={variant}>{title}</Title>}
          {headerChildren}
          <HeaderButton onClick={onRequestClose} variant={variant}>
            <CloseIcon
              color={
                variant === 'primary' ? theme.colors.light : theme.colors.copy
              }
            />
          </HeaderButton>
        </Header>
        {children}
      </Container>
    );
  }
}
