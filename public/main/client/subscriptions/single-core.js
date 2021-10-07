'use strict'

const handlers = require('../handlers')
const utils = require('./utils')

const withCore = core => fn => data => fn(data, core)

const listeners = {
  'get-convert-coin-gas-limit': handlers.getConvertCoinGasLimit,
  'get-convert-coin-estimate': handlers.getConvertCoinEstimate,
  'get-convert-lmr-gas-limit': handlers.getConvertLmrGasLimit,
  'refresh-all-transactions': handlers.refreshAllTransactions,
  'get-convert-lmr-estimate': handlers.getConvertLmrEstimate,
  'get-tokens-gas-limit': handlers.getTokensGasLimit,
  'refresh-transaction': handlers.refreshTransaction,
  'get-export-gas-limit': handlers.getExportLmrGas,
  'buy-lumerin': handlers.buyLumerin,
  'get-gas-limit': handlers.getGasLimit,
  'get-gas-price': handlers.getGasPrice,
  'convert-coin': handlers.convertCoin,
  'convert-lmr': handlers.convertLmr,
  'send-coin': handlers.sendCoin,
  'send-lmr': handlers.sendLmr
}

const coreListeners = {}

// Subscribe to messages where only one particular core has to react
function subscribeSingleCore (core) {
  coreListeners[core.chain] = {}
  Object.keys(listeners).forEach(function (key) {
    coreListeners[core.chain][key] = withCore(core)(listeners[key])
  })

  utils.subscribeTo(coreListeners[core.chain], core.chain)
}

const unsubscribeSingleCore = core =>
  utils.unsubscribeTo(coreListeners[core.chain])

module.exports = { subscribeSingleCore, unsubscribeSingleCore }
