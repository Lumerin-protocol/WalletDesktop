import React from 'react';
import styled from 'styled-components';

import withLoginState from '@lumerin/wallet-ui-logic/src/hocs/withLoginState';

import { TextInput, AltLayout, BaseBtn, Sp } from './common';

const LoginBtn = styled(BaseBtn)`
  font-size: 1.5rem;
  font-weight: bold;
  height: 40px;
  border-radius: 5px;
  background-color: ${p => p.theme.colors.primary}
  color: ${p => p.theme.colors.light}

  @media (min-width: 1040px) {
    margin-left: 0;
    margin-top: 1.6rem;
  }
`;

function Login({ onInputChange, onSubmit, password, errors, status, error }) {
  return (
    <AltLayout title="Enter your password">
      <form onSubmit={onSubmit} data-testid="login-form">
        <Sp mt={4}>
          <TextInput
            id="password"
            type="password"
            label="Password"
            value={password}
            data-testid="pass-field"
            autoFocus
            onChange={onInputChange}
            error={errors.password || error}
          />
        </Sp>
        <Sp mt={6}>
          <LoginBtn block submit disabled={status === 'pending'}>
            Login
          </LoginBtn>
        </Sp>
      </form>
    </AltLayout>
  );
}

export default withLoginState(Login);
