'use strict';

const handlers = require('../handlers');
const utils = require('./utils');

const listeners = {
  'validate-password': handlers.validatePassword,
  'change-password': handlers.changePassword,
  'persist-state': handlers.persistState,
  'clear-cache': handlers.clearCache,
  'handle-client-error': handlers.handleClientSideError,
  'get-pool-address': handlers.getPoolAddress,
  'reveal-secret-phrase': handlers.revealSecretPhrase,
  'has-stored-secret-phrase': handlers.hasStoredSecretPhrase,
  "logout": handlers.logout,
  "save-proxy-router-settings": handlers.saveProxyRouterSettings,
  "get-proxy-router-settings": handlers.getProxyRouterSettings,
  "get-default-currency-settings": handlers.getDefaultCurrency,
  "set-default-currency-settings": handlers.setDefaultCurrency,
};

// Subscribe to messages where no core has to react
const subscribeWithoutCore = () =>
  utils.subscribeTo(listeners, 'none');

const unsubscribeWithoutCore = () =>
  utils.unsubscribeTo(listeners);

module.exports = { subscribeWithoutCore, unsubscribeWithoutCore };
