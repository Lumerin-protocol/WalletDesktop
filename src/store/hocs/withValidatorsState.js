import { withClient } from './clientContext';
import selectors from '../selectors';
import { connect } from 'react-redux';
import React from 'react';

const withValidatorsState = WrappedComponent => {
  class Container extends React.Component {
    static displayName = `withValidatorsState(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      return (
        <WrappedComponent
          getValidator={this.props.client.getValidator}
          isProxyPortPublic={this.props.client.isProxyPortPublic}
          registerValidator={this.props.client.registerValidator}
          getValidatorsMinimalStake={
            this.props.client.getValidatorsMinimalStake
          }
          getValidatorsRegisterStake={
            this.props.client.getValidatorsRegisterStake
          }
          deregisterValidator={this.props.client.deregisterValidator}
          {...this.props}
          {...this.state}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => ({
    address: selectors.getWalletAddress(state)
  });

  return connect(mapStateToProps)(withClient(Container));
};

export default withValidatorsState;
