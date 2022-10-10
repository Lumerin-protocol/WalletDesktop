import { connect } from 'react-redux';

import selectors from '../selectors';
import { withClient } from './clientContext';

const withTxListState = Component => {
  const WrappedComponent = props => {
    return (
      <Component
        transactions={props.transactions}
        syncStatus={props.syncStatus}
        onTransactionLinkClick={props.client.onTransactionLinkClick}
      />
    );
  };

  const mapStateToProps = state => ({
    transactions: selectors.getTransactions(state)
  });

  return withClient(connect(mapStateToProps)(WrappedComponent));
};

export default withTxListState;
