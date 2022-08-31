import * as utils from '@lumerin/wallet-ui-logic/src/utils';
import PropTypes from 'prop-types';
import React from 'react';

import { TextInput, AltLayout, Btn, Sp } from '../common';
import SecondaryBtn from './SecondaryBtn';
import Message from './Message';

const VerifyMnemonicStep = props => {
  return (
    <AltLayout title="Recovery Passphrase" data-testid="onboarding-container">
      <form data-testid="mnemonic-form" onSubmit={props.onMnemonicAccepted}>
        <Message>
          To verify you have copied the recovery passphrase correctly, enter the
          12 words provided before in the field below.
        </Message>
        <Sp mt={3} mx={-8}>
          <TextInput
            id="mnemonicAgain"
            data-testid="mnemonic-field"
            autoFocus
            onChange={props.onInputChange}
            label="Recovery passphrase"
            error={props.errors.mnemonicAgain}
            value={props.mnemonicAgain || ''}
            rows={3}
          />
        </Sp>
        <Sp mt={5}>
          <Btn
            data-rh-negative
            data-disabled={!props.shouldSubmit(props.mnemonicAgain)}
            data-rh={props.getTooltip(props.mnemonicAgain)}
            submit={props.shouldSubmit(props.mnemonicAgain)}
            block
            key="sendMnemonic"
          >
            Done
          </Btn>
        </Sp>
        <Sp mt={2}>
          <SecondaryBtn
            data-testid="goback-btn"
            onClick={props.onMnemonicCopiedToggled}
            block
          >
            Go back
          </SecondaryBtn>
        </Sp>
      </form>
    </AltLayout>
  );
};

VerifyMnemonicStep.propTypes = {
  onMnemonicCopiedToggled: PropTypes.func.isRequired,
  onMnemonicAccepted: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  mnemonicAgain: PropTypes.string,
  shouldSubmit: PropTypes.func.isRequired,
  getTooltip: PropTypes.func.isRequired,
  errors: utils.errorPropTypes('mnemonicAgain')
};

export default VerifyMnemonicStep;
