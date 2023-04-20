import { withClient } from './clientContext';
import selectors from '../selectors';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { ToastsContext } from '../../components/toasts';

const withContractsState = WrappedComponent => {
  class Container extends React.Component {
    // static propTypes = {
    //   sendLmrFeatureStatus: PropTypes.oneOf(['offline', 'no-funds', 'ok'])
    //     .isRequired,
    //   syncStatus: PropTypes.oneOf(['up-to-date', 'syncing', 'failed'])
    //     .isRequired,
    //   address: PropTypes.string.isRequired,
    //   client: PropTypes.shape({
    //     refreshAllContracts: PropTypes.func.isRequired,
    //     copyToClipboard: PropTypes.func.isRequired
    //   }).isRequired
    // }

    static contextType = ToastsContext;

    static displayName = `withContractsState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    state = {
      refreshStatus: 'init',
      refreshError: null
    };

    contractsRefresh = () => {
      const capturedThis = this;
      this.setState({ refreshStatus: 'pending', refreshError: null });
      this.props.client
        .refreshAllContracts({})
        .then(() => this.setState({ refreshStatus: 'success' }))
        .catch(e => {
          capturedThis.context.toast('error', e.message);
          capturedThis.props.setFailedRefresh();
        });
    };

    onWalletRefresh = () => {
      this.setState({ refreshStatus: 'pending', refreshError: null });
      this.props.client
        .refreshAllTransactions({
          address: this.props.address,
          chain: this.props.chain
        })
        .then(() => this.setState({ refreshStatus: 'success' }))
        .catch(() =>
          this.setState({
            refreshStatus: 'failure',
            refreshError: 'Could not refresh'
          })
        );
    };

    render() {
      return (
        <WrappedComponent
          copyToClipboard={this.props.client.copyToClipboard}
          contractsRefresh={this.contractsRefresh}
          onWalletRefresh={this.onWalletRefresh}
          getLocalIp={this.props.client.getLocalIp}
          getPoolAddress={this.props.client.getPoolAddress}
          {...this.props}
          {...this.state}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    hasContracts: selectors.hasContracts(state),
    activeCount: selectors.getActiveContractsCount(state),
    draftCount: selectors.getDraftContractsCount(state),
    syncStatus: selectors.getContractsSyncStatus(state),
    address: selectors.getWalletAddress(state),
    contracts: selectors.getMergeAllContracts(state),
    lmrBalance: selectors.getWalletLmrBalance(state),
    allowSendTransaction: selectors.isAllowSendTransaction(state)
  });

  const mapDispatchToProps = dispatch => ({
    setIp: ip => dispatch({ type: 'ip-received', payload: ip }),
    setFailedRefresh: () => dispatch({ type: 'contracts-scan-failed' }),
    setDefaultBuyerPool: pool =>
      dispatch({ type: 'buyer-default-pool-received', payload: pool })
  });

  return withClient(connect(mapStateToProps, mapDispatchToProps)(Container));
};

export default withContractsState;
