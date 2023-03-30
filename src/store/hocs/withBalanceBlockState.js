import { withClient } from './clientContext';
import selectors from '../selectors';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    ethBalance: selectors.getWalletEthBalance(state),
    ethBalanceUSD: selectors.getWalletEthBalanceUSD(state),

    lmrBalance: selectors.getWalletLmrBalance(state),
    lmrBalanceUSD: selectors.getWalletLmrBalanceUSD(state),

    recaptchaSiteKey: selectors.getRecaptchaSiteKey(state)
  };
};

export default Component => withClient(connect(mapStateToProps)(Component));
