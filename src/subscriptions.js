export const subscribeToMainProcessMessages = function(store) {
  const ipcMessages = [
    'indexer-connection-status-changed',
    'lumerin-token-status-changed',
    'web3-connection-status-changed',
    'connectivity-state-changed',
    'proxy-router-connections-changed',
    'proxy-router-status-changed',
    'proxy-router-error',
    'transactions-scan-finished',
    'transactions-scan-started',
    'contracts-scan-finished',
    'contracts-scan-started',
    'wallet-state-changed',
    'coin-price-updated',
    'create-wallet',
    'open-wallet',
    'eth-balance-changed',
    'token-balance-changed',
    'token-contract-received',
    'token-transactions-changed',
    'wallet-transactions-changed',
    'eth-tx',
    'lmr-tx',
    'coin-block'
  ];

  // Subscribe to every IPC message defined above and dispatch a
  // Redux action of type { type: MSG_NAME, payload: MSG_ARG }
  ipcMessages.forEach(msgName =>
    window.ipcRenderer.on(msgName, (_, payload) =>
      store.dispatch({ type: msgName, payload })
    )
  );
};
