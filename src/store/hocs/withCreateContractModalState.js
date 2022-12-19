import { withClient } from './clientContext';
import selectors from '../selectors';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

const withCreateContractModalState = WrappedComponent => {
  class Container extends React.Component {
    // static propTypes = {
    //   address: PropTypes.string.isRequired,
    //   client: PropTypes.shape({
    //     copyToClipboard: PropTypes.func.isRequired
    //   }).isRequired
    // }

    static displayName = `withCreateContractModalState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    state = {
      copyBtnLabel: ''
    };

    createContract = contract => {
      this.props.client
        .copyToClipboard(this.props.address)
        .then(() => this.setState({ copyBtnLabel: 'Copied to clipboard!' }))
        .catch(err => this.setState({ copyBtnLabel: err.message }));
    };

    render() {
      return (
        <WrappedComponent
          copyToClipboard={this.props.client.copyToClipboard}
          {...this.props}
          {...this.state}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    address: selectors.getWalletAddress(state),
    explorerUrl: props.contract
      ? selectors.getContractExplorerUrl(state, {
          hash: props.contract.id
        })
      : null
  });

  return connect(mapStateToProps)(withClient(Container));
};

export default withCreateContractModalState;
