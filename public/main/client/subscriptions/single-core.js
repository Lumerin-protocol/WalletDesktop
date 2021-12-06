'use strict';

const handlers = require('../handlers');
const utils = require('./utils');

const withCore = core => fn => data => fn(data, core);

const listeners = {
  'refresh-all-sockets': handlers.refreshAllSockets,
  'refresh-all-transactions': handlers.refreshAllTransactions,
  'refresh-transaction': handlers.refreshTransaction,
  'get-gas-limit': handlers.getGasLimit,
  'get-gas-price': handlers.getGasPrice,
  'send-lmr': handlers.sendLmr
};

let coreListeners = {};

// Subscribe to messages where only one particular core has to react
function subscribeSingleCore (core) {
  coreListeners[core.chain] = {};
  Object.keys(listeners).forEach(function (key) {
    coreListeners[core.chain][key] = withCore(core)(listeners[key]);
  });

  utils.subscribeTo(coreListeners[core.chain], core.chain);
}

const unsubscribeSingleCore = core => utils.unsubscribeTo(coreListeners[core.chain]);

module.exports = { subscribeSingleCore, unsubscribeSingleCore };
