import { withClient } from './clientContext';
import selectors from '../selectors';
import { connect } from 'react-redux';

const mapStateToProps = (state, { client }) => {
  return {
    ethBalance: selectors.getWalletEthBalance(state),
    lmrBalance: selectors.getWalletLmrBalance(state)
  };
};

export default Component => withClient(connect(mapStateToProps)(Component));
