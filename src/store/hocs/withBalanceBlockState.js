import { withClient } from './clientContext';
import selectors from '../selectors';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    ethBalance: selectors.getWalletEthBalance(state),
    ethBalanceUSD: selectors.getWalletEthBalanceUSD(state),

    lmrBalance: selectors.getWalletLmrBalance(state),
    lmrBalanceUSD: selectors.getWalletLmrBalanceUSD(state),

    recaptchaSiteKey: selectors.getRecaptchaSiteKey(state),
    faucetUrl: selectors.getFaucetUrl(state),
    walletAddress: selectors.getWalletAddress(state)
  };
};

export default Component => withClient(connect(mapStateToProps)(Component));
