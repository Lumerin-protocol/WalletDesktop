import debounce from 'lodash/debounce';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';

import * as utils from './utils';
import keys from './keys';
import { getSessionPassword } from './secure';
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
      'https://github.com/Lumerin-protocol/lumerin-overview/blob/main/docs/00-overview.md'
    );

  const onHelpLinkClick = () => window.openLink('https://lumerin.gitbook.io');

  const onLinkClick = url => window.openLink(url);

  const copyToClipboard = text => Promise.resolve(window.copyToClipboard(text));

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
    onOnboardingCompleted: utils.forwardToMainProcess('onboarding-completed'),
    recoverFromMnemonic: utils.forwardToMainProcess('recover-from-mnemonic'),
    getTokenGasLimit: utils.forwardToMainProcess('get-token-gas-limit'),
    validatePassword: utils.forwardToMainProcess('validate-password'),
    changePassword: utils.forwardToMainProcess('change-password'),
    onLoginSubmit: utils.forwardToMainProcess('login-submit'),
    createContract: utils.forwardToMainProcess('create-contract', 750000),
    purchaseContract: utils.forwardToMainProcess('purchase-contract', 750000),
    cancelContract: utils.forwardToMainProcess('cancel-contract', 750000),
    getGasLimit: utils.forwardToMainProcess('get-gas-limit'),
    getGasPrice: utils.forwardToMainProcess('get-gas-price'),
    sendLmr: utils.forwardToMainProcess('send-lmr', 750000),
    sendEth: utils.forwardToMainProcess('send-eth', 750000),
    clearCache: utils.forwardToMainProcess('clear-cache'),
    startDiscovery: utils.forwardToMainProcess('start-discovery'),
    stopDiscovery: utils.forwardToMainProcess('stop-discovery'),
    setMinerPool: utils.forwardToMainProcess('set-miner-pool'),
    getLmrTransferGasLimit: utils.forwardToMainProcess(
      'get-lmr-transfer-gas-limit'
    ),
    logout: utils.forwardToMainProcess('logout'),
    getLocalIp: utils.forwardToMainProcess('get-local-ip'),
    getPoolAddress: utils.forwardToMainProcess('get-pool-address'),
    getProxyRouterSettings: utils.forwardToMainProcess(
      'get-proxy-router-settings'
    ),
    saveProxyRouterSettings: utils.forwardToMainProcess(
      'save-proxy-router-settings'
    ),
    restartProxyRouter: utils.forwardToMainProcess('restart-proxy-router'),
    claimFaucet: utils.forwardToMainProcess('claim-faucet', 750000)
  };

  const api = {
    getSessionPassword,
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
    store
  };

  return api;
};

export default createClient;
