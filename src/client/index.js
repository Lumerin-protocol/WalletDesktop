import debounce from 'lodash/debounce';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';

import * as utils from './utils';
import keys from './keys';
import './sentry';

const createClient = function(createStore) {
  const reduxDevtoolsOptions = {
    // actionsBlacklist: ['price-updated$'],
    features: { dispatch: true }
    // maxAge: 100 // default: 50
  };

  const store = createStore(reduxDevtoolsOptions);

  window.ipcRenderer.on('ui-ready', (ev, payload) => {
    const debounceTime = get(
      payload,
      'data.config.statePersistanceDebounce',
      0
    );

    // keysToPersist keys that are passed from global redux state to main process.
    // For now only chain data is used.
    // TODO: subscribe for changes only within listed branch of redux state
    const keysToPersist = ['chain'];

    store.subscribe(
      debounce(
        function() {
          const passedState = pickBy(store.getState(), function(value, key) {
            return keysToPersist.includes(key);
          });

          utils
            .forwardToMainProcess('persist-state')(passedState)
            .catch(err =>
              // eslint-disable-next-line no-console
              console.warn(`Error persisting state: ${err.message}`)
            );
        },
        debounceTime,
        { maxWait: 2 * debounceTime }
      )
    );
  });

  const onTransactionLinkClick = txHash =>
    window.openLink('https://etherscan.io/tx/' + txHash);

  const onTermsLinkClick = () =>
    window.openLink(
      'https://github.com/Lumerin-protocol/WalletDesktop/blob/main/LICENSE'
    );

  const onHelpLinkClick = () => window.openLink('https://lumerin.gitbook.io');

  const onLinkClick = url => window.openLink(url);

  const copyToClipboard = text => Promise.resolve(window.copyToClipboard(text));

  const lockSendTransaction = () => {
    store.dispatch({
      type: 'allow-send-transaction',
      payload: { allowSendTransaction: false }
    });
  };

  const unlockSendTransaction = () => {
    store.dispatch({
      type: 'allow-send-transaction',
      payload: { allowSendTransaction: true }
    });
  };

  const onInit = () => {
    window.addEventListener('beforeunload', function() {
      utils.sendToMainProcess('ui-unload');
    });
    window.addEventListener('online', () => {
      store.dispatch({
        type: 'connectivity-state-changed',
        payload: { ok: true }
      });
    });
    window.addEventListener('offline', () => {
      store.dispatch({
        type: 'connectivity-state-changed',
        payload: { ok: false }
      });
    });
    return utils.sendToMainProcess('ui-ready');
  };

  const forwardedMethods = {
    // refreshAllSockets: utils.forwardToMainProcess(
    //   'refresh-all-sockets',
    //   120000
    // ),
    refreshAllTransactions: utils.forwardToMainProcess(
      'refresh-all-transactions',
      120000
    ),
    refreshTransaction: utils.forwardToMainProcess(
      'refresh-transaction',
      120000
    ),
    refreshAllContracts: utils.forwardToMainProcess(
      'refresh-all-contracts',
      120000
    ),
    startWatchingContracts: utils.forwardToMainProcess(
      'start-watching-contracts',
      120000
    ),
    onOnboardingCompleted: utils.forwardToMainProcess('onboarding-completed'),
    recoverFromMnemonic: utils.forwardToMainProcess('recover-from-mnemonic'),
    getTokenGasLimit: utils.forwardToMainProcess('get-token-gas-limit'),
    validatePassword: utils.forwardToMainProcess('validate-password'),
    changePassword: utils.forwardToMainProcess('change-password'),
    onLoginSubmit: utils.forwardToMainProcess('login-submit'),
    createContract: utils.forwardToMainProcess('create-contract', 750000),
    purchaseContract: utils.forwardToMainProcess('purchase-contract', 750000),
    editContract: utils.forwardToMainProcess('edit-contract', 750000),
    cancelContract: utils.forwardToMainProcess('cancel-contract', 750000),
    setDeleteContractStatus: utils.forwardToMainProcess(
      'set-delete-contract-status',
      750000
    ),
    getGasLimit: utils.forwardToMainProcess('get-gas-limit'),
    getGasPrice: utils.forwardToMainProcess('get-gas-price'),
    getPastTransactions: utils.forwardToMainProcess(
      'get-past-transactions',
      750000
    ),
    sendLmr: utils.forwardToMainProcess('send-lmr', 750000),
    sendEth: utils.forwardToMainProcess('send-eth', 750000),
    clearCache: utils.forwardToMainProcess('clear-cache'),
    handleClientSideError: utils.forwardToMainProcess('handle-client-error'),
    startDiscovery: utils.forwardToMainProcess('start-discovery'),
    stopDiscovery: utils.forwardToMainProcess('stop-discovery'),
    setMinerPool: utils.forwardToMainProcess('set-miner-pool'),
    getLmrTransferGasLimit: utils.forwardToMainProcess(
      'get-lmr-transfer-gas-limit'
    ),
    logout: utils.forwardToMainProcess('logout'),
    getLocalIp: utils.forwardToMainProcess('get-local-ip'),
    isProxyPortPublic: utils.forwardToMainProcess('is-proxy-port-public'),
    getPoolAddress: utils.forwardToMainProcess('get-pool-address'),
    revealSecretPhrase: utils.forwardToMainProcess('reveal-secret-phrase'),
    getPrivateKey: utils.forwardToMainProcess('get-private-key'),
    hasStoredSecretPhrase: utils.forwardToMainProcess(
      'has-stored-secret-phrase'
    ),
    getProxyRouterSettings: utils.forwardToMainProcess(
      'get-proxy-router-settings'
    ),
    getDefaultCurrencySetting: utils.forwardToMainProcess(
      'get-default-currency-settings'
    ),
    setDefaultCurrencySetting: utils.forwardToMainProcess(
      'set-default-currency-settings'
    ),
    saveProxyRouterSettings: utils.forwardToMainProcess(
      'save-proxy-router-settings'
    ),
    restartProxyRouter: utils.forwardToMainProcess('restart-proxy-router'),
    stopProxyRouter: utils.forwardToMainProcess('stop-proxy-router'),
    getMarketplaceFee: utils.forwardToMainProcess('get-marketplace-fee'),
    claimFaucet: utils.forwardToMainProcess('claim-faucet', 750000),
    getCustomEnvValues: utils.forwardToMainProcess('get-custom-env-values'),
    setCustomEnvValues: utils.forwardToMainProcess('set-custom-env-values'),
    getContractHashrate: utils.forwardToMainProcess('get-contract-hashrate')
  };

  const api = {
    ...utils,
    ...forwardedMethods,
    isValidMnemonic: keys.isValidMnemonic,
    createMnemonic: keys.createMnemonic,
    onTermsLinkClick,
    onTransactionLinkClick,
    copyToClipboard,
    onHelpLinkClick,
    getAppVersion: window.getAppVersion,
    onLinkClick,
    onInit,
    store,
    lockSendTransaction,
    unlockSendTransaction
  };

  return api;
};

export default createClient;
