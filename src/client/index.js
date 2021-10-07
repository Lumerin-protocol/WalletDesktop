import fastPasswordEntropy from 'fast-password-entropy';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

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
    store.subscribe(
      debounce(
        function() {
          utils
            .forwardToMainProcess('persist-state')(store.getState())
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

  const onTermsLinkClick = () =>
    window.openLink(
      'https://github.com/TitanInd/lumerin-wallet-desktop/blob/develop/LICENSE'
    );

  const onHelpLinkClick = () =>
    window.openLink(
      'https://github.com/TitanInd/documentation/blob/master/FAQ.md#lumerin-faq'
    );

  const onLinkClick = url => window.openLink(url);

  const getStringEntropy = fastPasswordEntropy;

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
    getConvertCoinGasLimit: utils.forwardToMainProcess(
      'get-convert-coin-gas-limit'
    ),
    getConvertLmrGasLimit: utils.forwardToMainProcess(
      'get-convert-lmr-gas-limit'
    ),
    getConvertCoinEstimate: utils.forwardToMainProcess(
      'get-convert-coin-estimate'
    ),
    getConvertLmrEstimate: utils.forwardToMainProcess(
      'get-convert-lmr-estimate'
    ),
    refreshAllTransactions: utils.forwardToMainProcess(
      'refresh-all-transactions',
      120000
    ),
    refreshTransaction: utils.forwardToMainProcess(
      'refresh-transaction',
      120000
    ),
    onOnboardingCompleted: utils.forwardToMainProcess('onboarding-completed'),
    recoverFromMnemonic: utils.forwardToMainProcess('recover-from-mnemonic'),
    getImportGasLimit: utils.forwardToMainProcess('get-import-gas-limit'),
    getExportGasLimit: utils.forwardToMainProcess('get-export-gas-limit'),
    getTokensGasLimit: utils.forwardToMainProcess('get-tokens-gas-limit'),
    portLumerin: utils.forwardToMainProcess('port-lumerin', 750000),
    validatePassword: utils.forwardToMainProcess('validate-password'),
    buyLumerin: utils.forwardToMainProcess('buy-lumerin', 750000),
    convertCoin: utils.forwardToMainProcess('convert-coin', 750000),
    retryImport: utils.forwardToMainProcess('retry-import', 750000),
    convertLmr: utils.forwardToMainProcess('convert-lmr', 750000),
    changePassword: utils.forwardToMainProcess('change-password'),
    onLoginSubmit: utils.forwardToMainProcess('login-submit'),
    getPortFees: utils.forwardToMainProcess('get-port-fees'),
    getGasLimit: utils.forwardToMainProcess('get-gas-limit'),
    getGasPrice: utils.forwardToMainProcess('get-gas-price'),
    sendCoin: utils.forwardToMainProcess('send-coin', 750000),
    sendLmr: utils.forwardToMainProcess('send-lmr', 750000),
    clearCache: utils.forwardToMainProcess('clear-cache')
  };

  const api = {
    ...utils,
    ...forwardedMethods,
    isValidMnemonic: keys.isValidMnemonic,
    createMnemonic: keys.createMnemonic,
    onTermsLinkClick,
    getStringEntropy,
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
