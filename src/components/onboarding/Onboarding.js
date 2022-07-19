import withOnboardingState from '@lumerin/wallet-ui-logic/src/hocs/withOnboardingState';
import PropTypes from 'prop-types';
import React from 'react';

import VerifyMnemonicStep from './VerifyMnemonicStep';
import CopyMnemonicStep from './CopyMnemonicStep';
import UserMnemonicStep from './UserMnemonicStep';
import PasswordStep from './PasswordStep';
import TermsStep from './TermsStep';

const Onboarding = props => {
  const page = () => {
    switch (props.currentStep) {
      case 'ask-for-terms':
        return <TermsStep {...props} />;
      case 'define-password':
        return <PasswordStep {...props} />;
      case 'copy-mnemonic':
        return <CopyMnemonicStep {...props} />;
      case 'verify-mnemonic':
        return <VerifyMnemonicStep {...props} />;
      case 'recover-from-mnemonic':
        return <UserMnemonicStep {...props} />;
      default:
        return null;
    }
  };

  return <>{page()}</>;
};

Onboarding.propTypes = {
  currentStep: PropTypes.oneOf([
    'recover-from-mnemonic',
    'define-password',
    'verify-mnemonic',
    'ask-for-terms',
    'copy-mnemonic'
  ]).isRequired
};

export default withOnboardingState(Onboarding);
