import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useEffect } from 'react';

import { Modal, BaseBtn } from '../common';
import { Container, Message, Button } from './ConfirmModal.styles';
import { Input } from './Tools';
import { useState } from 'react';

export const RestartNowBtn = styled(Button)`
  width: 40%;
  display: inline-block;
`;

export const LaterBtn = styled(Button)`
  width: 40%;
  border: 1px solid ${p => p.theme.colors.primary};
  background-color: ${p => p.theme.colors.light};
  color: ${p => p.theme.colors.primary};
  display: inline-block;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Mnemonic = styled.div`
  padding: 10px 0;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 2;
  text-align: center;
  color: ${p => p.theme.colors.primary};
  word-spacing: 1.6rem;
`;

const RevealSecretPhraseModal = props => {
  // eslint-disable-next-line complexity
  const {
    onRequestClose,
    onShowMnemonic,
    isOpen,
    mnemonic,
    copyToClipboard
  } = props;
  const [password, setPassword] = useState('');

  const closeWrapper = () => {
    setPassword('');
    onRequestClose();
  };

  return (
    <Modal
      shouldReturnFocusAfterClose={false}
      onRequestClose={closeWrapper}
      styleOverrides={{
        width: 450,
        top: '35%'
      }}
      variant="primary"
      isOpen={isOpen}
      title="Reveal Secret Recovery Phrase"
    >
      <Container data-testid="confirm-proxy-config-modal">
        {mnemonic ? (
          <Mnemonic>{mnemonic}</Mnemonic>
        ) : (
          <>
            <Message>
              The Secret Recovery Phrase provides full access to your wallet and
              funds.
            </Message>
            <Message>
              <div>Enter password to continue: </div>
              <Input
                type={'password'}
                placeholder={'Make sure nobody is looking'}
                onChange={e => {
                  setPassword(e.value);
                }}
                value={password}
              />
            </Message>
          </>
        )}

        <Row style={{ justifyContent: 'space-around' }}>
          {mnemonic ? (
            <RestartNowBtn onClick={() => copyToClipboard(mnemonic)}>
              Copy to clipboard
            </RestartNowBtn>
          ) : (
            <RestartNowBtn
              disabled={!password}
              onClick={() => onShowMnemonic(password)}
            >
              Show
            </RestartNowBtn>
          )}
          <LaterBtn onClick={closeWrapper}>Close</LaterBtn>
        </Row>
      </Container>
    </Modal>
  );
};

RevealSecretPhraseModal.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onShowMnemonic: PropTypes.func.isRequired,
  copyToClipboard: PropTypes.func.isRequired
};

export default RevealSecretPhraseModal;
