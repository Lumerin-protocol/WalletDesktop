'use strict'

const pTimeout = require('p-timeout')

const logger = require('../../../logger')
const auth = require('../auth')
const config = require('../../../config')
const wallet = require('../wallet')
const WalletError = require('../WalletError')

const withAuth = fn =>
  function (data, { coreApi }) {
    if (typeof data.walletId !== 'string') {
      throw new WalletError('WalletId is not defined')
    }
    return auth
      .isValidPassword(data.password)
      .then(() => wallet.getSeed(data.walletId, data.password))
      .then(coreApi.wallet.createPrivateKey)
      .then(privateKey => fn(privateKey, data))
  }

function createWallet (data, { coreApi, emitter }) {
  const walletId = wallet.getWalletId(data.seed)
  const address = coreApi.wallet.createAddress(data.seed)
  return Promise.all([
    wallet.setSeed(data.seed, data.password),
    wallet.setAddressForWalletId(walletId, address)
  ])
    .then(() => wallet.setActiveWallet(walletId))
    .then(() => emitter.emit('create-wallet', { walletId }))
}

function openWallet ({ emitter }) {
  const activeWallet = wallet.getActiveWallet() || wallet.getWallets()[0]
  wallet.getAddressesForWalletId(activeWallet).forEach(address =>
    emitter.emit('open-wallets', {
      walletIds: [activeWallet],
      activeWallet,
      address
    })
  )
}

function refreshAllTransactions ({ address }, { coreApi, emitter }) {
  emitter.emit('transactions-scan-started', {})
  return coreApi.explorer.refreshAllTransactions(address)
    .then(function () {
      emitter.emit('transactions-scan-finished', { success: true })
      return {}
    })
    .catch(function (error) {
      logger.warn('Could not sync transactions/events', error.stack)
      emitter.emit('transactions-scan-finished', {
        error: error.message,
        success: false
      })
      emitter.once('coin-block', () =>
        refreshAllTransactions({ address }, { coreApi, emitter })
      )
      return {}
    })
}

function refreshTransaction ({ hash, address }, { coreApi }) {
  return pTimeout(
    coreApi.explorer.refreshTransaction(hash, address),
    config.scanTransactionTimeout
  )
    .then(() => ({ success: true }))
    .catch(error => ({ error, success: false }))
}

const getGasLimit = (data, { coreApi }) => coreApi.wallet.getGasLimit(data)

const getGasPrice = (data, { coreApi }) => coreApi.wallet.getGasPrice(data)

const sendCoin = (data, { coreApi }) =>
  withAuth(coreApi.wallet.sendCoin)(data, { coreApi })

const getTokensGasLimit = (data, { coreApi }) =>
  coreApi.tokens.getTokensGasLimit(data)

const getAuctionGasLimit = (data, { coreApi }) =>
  coreApi.lumerin.getAuctionGasLimit(data)

const getConvertCoinEstimate = (data, { coreApi }) =>
  coreApi.lumerin.getConvertCoinEstimate(data)

const getConvertCoinGasLimit = (data, { coreApi }) =>
  coreApi.lumerin.getConvertCoinGasLimit(data)

const getConvertMetEstimate = (data, { coreApi }) =>
  coreApi.lumerin.getConvertMetEstimate(data)

const getConvertMetGasLimit = (data, { coreApi }) =>
  coreApi.lumerin.getConvertMetGasLimit(data)

const buyLumerin = (data, { coreApi }) =>
  withAuth(coreApi.lumerin.buyLumerin)(data, { coreApi })

const convertCoin = (data, { coreApi }) =>
  withAuth(coreApi.lumerin.convertCoin)(data, { coreApi })

const convertMet = (data, { coreApi }) =>
  withAuth(coreApi.lumerin.convertMet)(data, { coreApi })

const sendMet = (data, { coreApi }) =>
  withAuth(coreApi.lumerin.sendMet)(data, { coreApi })

const getExportMetFee = (data, { coreApi }) =>
  coreApi.lumerin.getExportMetFee(data)

const getExportGasLimit = (data, { coreApi }) =>
  coreApi.lumerin.estimateExportMetGas(
    Object.assign({}, data, {
      destinationChain: config.chains[data.destinationChain].symbol,
      destinationMetAddress:
        config.chains[data.destinationChain].metTokenAddress,
      extraData: '0x00' // TODO: complete with extra data as needed
    })
  )

const getImportGasLimit = (data, { coreApi }) =>
  coreApi.lumerin.estimateImportMetGas(data)

const exportLumerin = (data, core) =>
  withAuth(core.coreApi.lumerin.exportMet)(data, core)

const importLumerin = (data, core) =>
  withAuth(core.coreApi.lumerin.importMet)(data, core)

const getMerkleRoot = (data, { coreApi }) =>
  coreApi.lumerin.getMerkleRoot(data)

module.exports = {
  refreshAllTransactions,
  getConvertCoinEstimate,
  getConvertCoinGasLimit,
  getConvertMetEstimate,
  getConvertMetGasLimit,
  refreshTransaction,
  getAuctionGasLimit,
  getExportGasLimit,
  getImportGasLimit,
  getTokensGasLimit,
  getExportMetFee,
  exportLumerin,
  importLumerin,
  getMerkleRoot,
  buyLumerin,
  createWallet,
  getGasLimit,
  getGasPrice,
  convertCoin,
  convertMet,
  openWallet,
  sendMet,
  sendCoin
}
