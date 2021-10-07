import React, { useEffect, useContext } from 'react';
import withConnectionState from 'lumerin-wallet-ui-logic/src/hocs/withConnectionState';
import PropTypes from 'prop-types';

import { ToastsContext } from '../components/toasts';

function Web3ConnectionNotifier(props) {
  // static propTypes = {
  //   isConnected: PropTypes.bool,
  //   chainName: PropTypes.string
  // };

  const context = useContext(ToastsContext);

  useEffect(() => {
    // Only launch success toast when recovering from a disconnection
    if (props.isConnected === true) {
      context.toast('success', `Reconnected to ${props.chainName} network`);
    }
    // Only launch error toast if disconnected on init or after being connected
    if (props.isConnected === false) {
      context.toast('error', `Disconnected from ${props.chainName} network`, {
        autoClose: 15000
      });
    }
  }, []);

  return null;
}

// We have to do this indirection because React 16.7.0 doesn't support using
// both contextType and Redux context at the same time
export default withConnectionState(({ isConnected, chainName }) => (
  <Web3ConnectionNotifier isConnected={isConnected} chainName={chainName} />
));
