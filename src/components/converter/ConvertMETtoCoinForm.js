import withConvertLMRtoCoinState from 'lumerin-wallet-ui-logic/src/hocs/withConvertLMRtoCoinState';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';

import ConverterEstimates from './ConverterEstimates';
import MinReturnCheckbox from './MinReturnCheckbox';
import {
  ConfirmationWizard,
  DisplayValue,
  GasEditor,
  FieldBtn,
  TextInput,
  Flex,
  Btn,
  Sp
} from '../common';

const ConfirmationContainer = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;

  & > div {
    color: ${p => p.theme.colors.primary};
  }
`;

const Footer = styled.div`
  background-image: linear-gradient(to bottom, #272727, #323232);
  padding: 3.2rem 2.4rem;
  flex-grow: 1;
  height: 100%;
`;

class ConvertLMRtoCoinForm extends React.Component {
  static propTypes = {
    onUseMinimumToggle: PropTypes.func.isRequired,
    gasEstimateError: PropTypes.bool,
    lmrPlaceholder: PropTypes.string,
    onInputChange: PropTypes.func.isRequired,
    estimateError: PropTypes.string,
    useCustomGas: PropTypes.bool.isRequired,
    coinSymbol: PropTypes.string.isRequired,
    onMaxClick: PropTypes.func.isRequired,
    useMinimum: PropTypes.bool.isRequired,
    lmrAmount: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    gasPrice: PropTypes.string,
    gasLimit: PropTypes.string,
    estimate: PropTypes.string,
    errors: PropTypes.shape({
      useMinimum: PropTypes.string,
      lmrAmount: PropTypes.string
    }).isRequired,
    tabs: PropTypes.node.isRequired,
    rate: PropTypes.string
  };

  renderConfirmation = () => {
    const { lmrAmount, estimate, rate } = this.props;
    return (
      <ConfirmationContainer data-testid="confirmation">
        You will convert{' '}
        <DisplayValue inline value={lmrAmount} post=" LMR" toWei /> and get
        approximately <DisplayValue inline value={estimate} isCoin />, which
        means a rate of{' '}
        <DisplayValue
          inline
          value={rate}
          post={` ${this.props.coinSymbol}/LMR`}
        />
        .
      </ConfirmationContainer>
    );
  };

  renderForm = goToReview => (
    <Flex.Column grow="1">
      {this.props.tabs}
      <Sp py={4} px={3}>
        <form
          data-testid="lmrToCoin-form"
          noValidate
          onSubmit={goToReview}
          id="convertForm"
        >
          <div>
            <FieldBtn
              data-testid="max-btn"
              tabIndex="-1"
              onClick={this.props.onMaxClick}
              float
            >
              MAX
            </FieldBtn>
            <TextInput
              placeholder={this.props.lmrPlaceholder}
              data-testid="lmrAmount-field"
              autoFocus
              onChange={this.props.onInputChange}
              error={this.props.errors.lmrAmount}
              label="Amount (LMR)"
              value={this.props.lmrAmount}
              id="lmrAmount"
            />
            <Sp mt={3}>
              <GasEditor
                gasEstimateError={this.props.gasEstimateError}
                onInputChange={this.props.onInputChange}
                useCustomGas={this.props.useCustomGas}
                gasLimit={this.props.gasLimit}
                gasPrice={this.props.gasPrice}
                errors={this.props.errors}
              />
            </Sp>
            <ConverterEstimates
              estimateError={this.props.estimateError}
              coinSymbol={this.props.coinSymbol}
              convertTo="coin"
              estimate={this.props.estimate}
              rate={this.props.rate}
            />
            <MinReturnCheckbox
              useMinimum={this.props.useMinimum}
              onToggle={this.props.onUseMinimumToggle}
              label={`Get expected ${this.props.coinSymbol} amount or cancel`}
              error={this.props.errors.useMinimum}
            />
          </div>
        </form>
      </Sp>
      <Footer>
        <Btn submit block form="convertForm">
          Review Convert
        </Btn>
      </Footer>
    </Flex.Column>
  );

  render() {
    return (
      <ConfirmationWizard
        renderConfirmation={this.renderConfirmation}
        onWizardSubmit={this.props.onSubmit}
        pendingTitle="Converting LMR..."
        pendingText="This may take a while. You can close this and follow the status of the conversion in the transaction list."
        renderForm={this.renderForm}
        editLabel="Edit this conversion"
        validate={this.props.validate}
      />
    );
  }
}

export default withConvertLMRtoCoinState(ConvertLMRtoCoinForm);
