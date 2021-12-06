import TermsAndConditions from '@lumerin/wallet-ui-logic/src/components/TermsAndConditions';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import { AltLayout, Btn, Sp } from '../common';
import Message from './Message';

const DisclaimerWarning = styled.div`
  text-align: center;
  color: ${p => p.theme.colors.dark}
  font-size: 16px;
  margin-top: 16px;
`;

const DisclaimerMessage = styled.div`
  width: 100%;
  height: 130px;
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.1);
  color: ${p => p.theme.colors.dark}
  overflow: auto;
  font-size: 12px;
  padding: 10px 16px 0 16px;
  margin: 16px 0;
`;

const P = styled.p`
  color: ${p => p.theme.colors.dark};
`;

// const AcceptBtn = styled(BaseBtn)`
//   height: 40px;
//   font-size: 1.5rem;
//   border-radius: 5px;
//   padding: 0 .6rem;
//   color: ${p => p.theme.colors.dark}
//   background-color: ${p => p.theme.colors.primary}
// `;
const Subtext = styled.span`
  color: ${p => p.theme.colors.dark};
`;

export default class TermsStep extends React.Component {
  static propTypes = {
    onTermsLinkClick: PropTypes.func.isRequired,
    onTermsAccepted: PropTypes.func.isRequired,
    licenseCheckbox: PropTypes.bool.isRequired,
    termsCheckbox: PropTypes.bool.isRequired,
    onInputChange: PropTypes.func.isRequired
  };

  onCheckboxToggle = e => {
    this.props.onInputChange({ id: e.target.id, value: e.target.checked });
  };

  render() {
    return (
      <AltLayout title="Accept to Continue" data-testid="onboarding-container">
        <DisclaimerWarning>
          Please read and accept these terms and conditions.
        </DisclaimerWarning>

        <DisclaimerMessage>
          <TermsAndConditions ParagraphComponent={props => <P {...props} />} />
        </DisclaimerMessage>

        <Message>
          <div>
            <input
              data-testid="accept-terms-chb"
              onChange={this.onCheckboxToggle}
              checked={this.props.termsCheckbox}
              type="checkbox"
              id="termsCheckbox"
            />
            <Subtext>I have read and accept these terms</Subtext>
          </div>
          <div>
            <input
              data-testid="accept-license-chb"
              onChange={this.onCheckboxToggle}
              checked={this.props.licenseCheckbox}
              type="checkbox"
              id="licenseCheckbox"
            />
            <Subtext>I have read and accept the </Subtext>
            <a onClick={this.props.onTermsLinkClick}>software license</a>.
          </div>
        </Message>

        <Sp mt={6}>
          <Btn
            data-testid="accept-terms-btn"
            autoFocus
            disabled={!this.props.licenseCheckbox || !this.props.termsCheckbox}
            onClick={this.props.onTermsAccepted}
            block
          >
            Accept
          </Btn>
        </Sp>
      </AltLayout>
    );
  }
}
