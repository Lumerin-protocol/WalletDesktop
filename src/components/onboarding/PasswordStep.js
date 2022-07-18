import * as utils from '@lumerin/wallet-ui-logic/src/utils';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { EntropyMeter, TextInput, AltLayout, Btn, Sp } from '../common';
import Message from './Message';

const PasswordMessage = styled(Message)`
  text-align: center;
  color: ${p => p.theme.colors.dark};
`;

const Green = styled.div`
  display: inline-block;
  color: ${p => p.theme.colors.success};
`;

const PasswordStep = props => {
  const onPasswordSubmit = e => {
    e.preventDefault();
    props.onPasswordSubmit({ clearOnError: false });
  };

  return (
    <AltLayout title="Define a Password" data-testid="onboarding-container">
      <form onSubmit={onPasswordSubmit} data-testid="pass-form">
        <PasswordMessage>
          Enter a strong password until the meter turns <Green>green</Green>.
        </PasswordMessage>
        <Sp mt={2}>
          <TextInput
            data-testid="pass-field"
            autoFocus
            onChange={props.onInputChange}
            noFocus
            error={props.errors.password}
            label="Password"
            value={props.password}
            type="password"
            id="password"
          />
          {!props.errors.password && (
            <EntropyMeter
              targetEntropy={props.requiredPasswordEntropy}
              password={props.password}
            />
          )}
        </Sp>
        <Sp mt={3}>
          <TextInput
            data-testid="pass-again-field"
            onChange={props.onInputChange}
            error={props.errors.passwordAgain}
            label="Repeat password"
            value={props.passwordAgain}
            type="password"
            id="passwordAgain"
          />
        </Sp>
        <Sp mt={6}>
          <Btn block submit>
            Continue
          </Btn>
        </Sp>
      </form>
    </AltLayout>
  );
};

PasswordStep.propTypes = {
  requiredPasswordEntropy: PropTypes.number.isRequired,
  onPasswordSubmit: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  passwordAgain: PropTypes.string,
  password: PropTypes.string,
  errors: utils.errorPropTypes('passwordAgain', 'password')
};

export default PasswordStep;
