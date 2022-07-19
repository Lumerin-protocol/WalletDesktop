import withChangePasswordState from '@lumerin/wallet-ui-logic/src/hocs/withChangePasswordState';
import { withRouter } from 'react-router-dom';
import * as utils from '@lumerin/wallet-ui-logic/src/utils';
import styled from 'styled-components';
import React, { useEffect, useContext } from 'react';

import { EntropyMeter, LightLayout, TextInput, BaseBtn, Sp } from './common';
import { ToastsContext } from '../components/toasts';

const Container = styled.div`
  padding: 3.2rem 2.4rem;
  max-width: 55rem;

  @media (min-width: 800px) {
    padding: 3.2rem 4.8rem;
  }
`;

const PasswordMessage = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 3.2rem;
  color: ${p => p.theme.colors.dark};
`;

const Green = styled.div`
  display: inline-block;
  color: ${p => p.theme.colors.success};
`;

const ErrorMessage = styled.div`
  color: ${p => p.theme.colors.danger}
  font-size: 1.2rem;
  margin-top: 2.4rem;
  margin-bottom: -3.9rem;
`;

const StyledBtn = styled(BaseBtn)`
  width: 40%;
  height: 40px;
  font-size: 1.5rem;
  border-radius: 5px;
  padding: 0 .6rem;
  background-color: ${p => p.theme.colors.primary}
  color: ${p => p.theme.colors.light}

  @media (min-width: 1040px) {
    width: 35%;
    height: 40px;
    margin-left: 0;
    margin-top: 1.6rem;
  }
`;

function ChangePassword({
  requiredPasswordEntropy,
  onInputChange,
  onSubmit,
  newPasswordAgain,
  newPassword,
  oldPassword,
  history,
  status,
  errors,
  error
}) {
  const context = useContext(ToastsContext);

  const handleSubmitAndNavigate = e => {
    e.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    if (status === 'success') {
      history.push('/tools');
      context.toast('success', 'Password successfully changed');
    }
  }, []);

  return (
    <LightLayout
      data-testid="change-password-container"
      title="Change your password"
    >
      <Container>
        <form
          data-testid="change-password-form"
          onSubmit={handleSubmitAndNavigate}
        >
          <Sp mt={2}>
            <TextInput
              data-testid="oldPassword-field"
              autoFocus
              onChange={onInputChange}
              label="Current Password"
              error={errors.oldPassword}
              value={oldPassword || ''}
              type="password"
              id="oldPassword"
            />
          </Sp>
          <PasswordMessage>
            Enter a strong password until the meter turns <Green>green</Green>.
          </PasswordMessage>
          <Sp mt={2}>
            <TextInput
              data-testid="newPassword-field"
              onChange={onInputChange}
              label="New Password"
              error={errors.newPassword}
              value={newPassword || ''}
              type="password"
              id="newPassword"
            />
            {!errors.newPassword && (
              <EntropyMeter
                targetEntropy={requiredPasswordEntropy}
                password={newPassword}
              />
            )}
          </Sp>
          <Sp mt={3}>
            <TextInput
              data-testid="newPassword-again-field"
              onChange={onInputChange}
              error={errors.newPasswordAgain}
              label="Repeat New Password"
              value={newPasswordAgain}
              type="password"
              id="newPasswordAgain"
            />
          </Sp>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Sp mt={8}>
            <StyledBtn submit disabled={status === 'pending'}>
              Change Password
            </StyledBtn>
          </Sp>
        </form>
      </Container>
    </LightLayout>
  );
}

export default withRouter(withChangePasswordState(ChangePassword));
