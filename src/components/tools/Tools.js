import { withRouter, NavLink } from 'react-router-dom';
import withToolsState from 'lumerin-wallet-ui-logic/src/hocs/withToolsState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import ConfirmModal from './ConfirmModal';
import WalletStatus from './WalletStatus';
import {
  ConfirmationWizard,
  LightLayout,
  TextInput,
  Flex,
  BaseBtn,
  Btn,
  Sp
} from '../common';

const Container = styled.div``;

const Confirmation = styled.div`
  color: ${p => p.theme.colors.danger};
  background-color: ${p => p.theme.colors.medium};
  border-radius: 4px;
  padding: 0.8rem 1.6rem;
`;
const ValidationMsg = styled.div`
  font-size: 1.4rem;
  margin-left: 1.6rem;
  opacity: 0.75;
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

const Subtitle = styled.h2`
  color: ${p => p.theme.colors.dark};
`;

const StyledParagraph = styled.p`
  color: ${p => p.theme.colors.dark};
`;

class Tools extends React.Component {
  static propTypes = {
    onRescanTransactions: PropTypes.func.isRequired,
    isRecoverEnabled: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    mnemonic: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    errors: PropTypes.shape({
      mnemonic: PropTypes.string
    }).isRequired
  };

  state = {
    activeModal: null
  };

  onCloseModal = () => {
    this.setState({ activeModal: null });
  };

  onRescanTransactionsClick = () => {
    this.setState({ activeModal: 'confirm-rescan' });
  };

  onWizardSubmit = password =>
    this.props
      .onSubmit(password)
      .then(() => this.props.history.push('/wallets'));

  renderConfirmation = () => (
    <Confirmation data-testid="confirmation">
      <h3>Are you sure?</h3>
      <p>This operation will overwrite and restart the current wallet!</p>
    </Confirmation>
  );

  renderForm = goToReview => {
    const { onInputChange, mnemonic, errors } = this.props;

    return (
      <Sp mt={-4}>
        <Subtitle>Recover a Wallet</Subtitle>
        <form data-testid="recover-form" onSubmit={goToReview}>
          <StyledParagraph>
            Enter a valid twelve-word recovery phrase to recover another wallet.
          </StyledParagraph>
          <StyledParagraph>
            This action will replace your current stored seed!
          </StyledParagraph>
          <TextInput
            data-testid="mnemonic-field"
            autoFocus
            onChange={onInputChange}
            label="Recovery phrase"
            error={errors.mnemonic}
            value={mnemonic || ''}
            rows={2}
            id="mnemonic"
          />
          <Sp mt={4}>
            <Flex.Row align="center">
              <StyledBtn disabled={!this.props.isRecoverEnabled} submit>
                Recover
              </StyledBtn>
              {!this.props.isRecoverEnabled && (
                <ValidationMsg>
                  A recovery phrase must have exactly 12 words
                </ValidationMsg>
              )}
            </Flex.Row>
          </Sp>
        </form>
        <Sp mt={5}>
          <hr />
          <Subtitle>Change Password</Subtitle>
          <StyledParagraph>
            This will allow you to change the password you use to access the
            wallet.
          </StyledParagraph>
          <NavLink data-testid="change-password-btn" to="/change-pass">
            <StyledBtn>Change Password</StyledBtn>
          </NavLink>
        </Sp>
        <Sp mt={5}>
          <hr />
          <Subtitle>Rescan Transactions List</Subtitle>
          <StyledParagraph>
            This will clear your local cache and rescan all your wallet
            transactions.
          </StyledParagraph>
          <StyledBtn onClick={this.onRescanTransactionsClick}>
            Rescan Transactions
          </StyledBtn>
          <ConfirmModal
            onRequestClose={this.onCloseModal}
            onConfirm={this.props.onRescanTransactions}
            isOpen={this.state.activeModal === 'confirm-rescan'}
          />
        </Sp>
        <Sp mt={5}>
          <hr />
          <h4>Wallet Information</h4>
          <WalletStatus />
        </Sp>
      </Sp>
    );
  };

  render() {
    return (
      <LightLayout title="Tools" data-testid="tools-container">
        <Sp py={4} px={6}>
          <ConfirmationWizard
            renderConfirmation={this.renderConfirmation}
            confirmationTitle=""
            onWizardSubmit={this.onWizardSubmit}
            pendingTitle="Recovering..."
            successText="Wallet successfully recovered"
            renderForm={this.renderForm}
            validate={this.props.validate}
            noCancel
            styles={{
              confirmation: {
                padding: 0
              },
              btns: {
                background: 'none',
                marginTop: '3.2rem',
                maxWidth: '200px',
                padding: 0
              }
            }}
          />
        </Sp>
      </LightLayout>
    );
  }
}

export default withToolsState(withRouter(Tools));
