import * as validators from '../validators';
import { withClient } from './clientContext';
import * as utils from '../utils';
import PropTypes from 'prop-types';
import React from 'react';
import { ToastsContext } from '../../components/toasts';

const withToolsState = WrappedComponent => {
  class Container extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        recoverFromMnemonic: PropTypes.func.isRequired,
        isValidMnemonic: PropTypes.func.isRequired,
        clearCache: PropTypes.func.isRequired
      }).isRequired
    };

    static contextType = ToastsContext;

    static displayName = `withToolsState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    state = {
      mnemonic: null,
      privateKey: null,
      errors: {},
      hasStoredSecretPhrase: false
    };

    componentDidMount() {
      this.props.client.hasStoredSecretPhrase().then(value => {
        this.setState({ ...this.state, hasStoredSecretPhrase: value });
      });
    }

    onInputChange = ({ id, value }) => {
      this.setState(state => ({
        ...state,
        [id]: value,
        errors: {
          ...state.errors,
          [id]: null
        }
      }));
    };

    onShowMnemonic = password => {
      this.props.client
        .revealSecretPhrase(password)
        .then(value => {
          this.setState({ ...this.state, mnemonic: value });
        })
        .catch(e => {
          this.context.toast('error', e.message);
        });
    };

    onExportPrivateKey = password => {
      this.props.client
        .getPrivateKey({ password })
        .then(({ privateKey }) => {
          this.setState({ ...this.state, privateKey: privateKey });
        })
        .catch(e => {
          this.context.toast('error', e.message);
        });
    };

    discardMnemonic = () => this.setState({ ...this.state, mnemonic: null });
    discardPrivateKey = () =>
      this.setState({ ...this.state, privateKey: null });

    onSubmit = password =>
      this.props.client.recoverFromMnemonic({
        mnemonic: utils.sanitizeMnemonic(this.state.mnemonic),
        password
      });

    validate = () => {
      const errors = {
        ...validators.validateMnemonic(this.props.client, this.state.mnemonic)
      };
      const hasErrors = Object.keys(errors).length > 0;
      if (hasErrors) this.setState({ errors });
      return !hasErrors;
    };

    onRescanTransactions = e => {
      if (e && e.preventDefault) e.preventDefault();
      this.props.client.clearCache();
    };

    onRunTest = e => {
      if (e && e.preventDefault) e.preventDefault();
      this.props.client.clearCache();
      console.log('RUN TEST');
    };

    logout = () => {
      return this.props.client.logout();
    };

    render() {
      const isRecoverEnabled =
        utils.sanitizeMnemonic(this.state.mnemonic || '').split(' ').length ===
        12;

      return (
        <WrappedComponent
          onRescanTransactions={this.onRescanTransactions}
          onRunTest={this.onRunTest}
          isRecoverEnabled={isRecoverEnabled}
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit}
          onShowMnemonic={this.onShowMnemonic}
          onExportPrivateKey={this.onExportPrivateKey}
          discardMnemonic={this.discardMnemonic}
          discardPrivateKey={this.discardPrivateKey}
          validate={this.validate}
          copyToClipboard={this.props.client.copyToClipboard}
          logout={this.logout}
          onRevealPhrase={this.props.client.revealSecretPhrase}
          getProxyRouterSettings={this.props.client.getProxyRouterSettings}
          saveProxyRouterSettings={this.props.client.saveProxyRouterSettings}
          restartProxyRouter={this.props.client.restartProxyRouter}
          {...this.state}
          {...this.props}
        />
      );
    }
  }

  return withClient(Container);
};

export default withToolsState;
