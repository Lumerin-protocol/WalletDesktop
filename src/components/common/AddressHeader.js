import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CopyIcon from '../icons/CopyIcon';
import { ToastsContext } from '../toasts';
import { BaseBtn } from '.';
import { abbreviateAddress } from '../../utils';

const Container = styled.header`
  padding: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  padding: 0.8rem;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
  cursor: default;
  font-weight: 600;
  opacity: 0;
  color: ${p => p.theme.colors.dark} @media (min-width: 800px) {
    opacity: 1;
  }
`;

const Bg = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 2px;
  background-color: ${p => p.theme.colors.lightShade};
`;

const Address = styled.div`
  padding: 0 1.6rem;
  font-size: 1.3rem;
  cursor: default;
  font-weight: 600;
  letter-spacing: normal;
  color: ${p => p.theme.colors.dark}
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 240px;
  @media (min-width: 960px) {
    max-width: 100%;
  }
`;

const CopyBtn = styled(BaseBtn)`
  background-color: ${p => p.theme.colors.light}
  border-radius: 5px;
  border: 1px;
  padding: 0 0;
  margin-left: .8rem;
`;

export default function AddressHeader({ copyToClipboard, address }) {
  // static propTypes = {
  //   copyToClipboard: PropTypes.func.isRequired,
  //   address: PropTypes.string.isRequired
  // }

  const context = useContext(ToastsContext);

  const onCopyToClipboardClick = () => {
    copyToClipboard(address);
    context.toast('info', 'Address copied to clipboard', {
      autoClose: 1500
    });
  };

  return (
    <Container>
      <AddressContainer>
        <Label>LMR Address</Label>
        <Bg>
          <Address data-testid="address">
            {abbreviateAddress(address, 10)}
          </Address>
        </Bg>
      </AddressContainer>
      <CopyBtn onClick={onCopyToClipboardClick}>
        <CopyIcon fill="black" size="3.8rem" />
      </CopyBtn>
    </Container>
  );
}
