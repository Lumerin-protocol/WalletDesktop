'use strict';

const pTimeout = require('p-timeout');

const logger = require('../../../logger');
const auth = require('../auth');
const config = require('../../../config');
const wallet = require('../wallet');
const WalletError = require('../WalletError');

const withAuth = (fn) => (data, { coreApi }) => {
    if (typeof data.walletId !== 'string') {
      throw new WalletError('WalletId is not defined');
    }
    return auth
      .isValidPassword(data.password)
      .then(() => wallet.getSeed(data.walletId, data.password))
      .then(coreApi.wallet.createPrivateKey)
      .then(privateKey => fn(privateKey, data));
  }

function createWallet (data, { coreApi, emitter }) {
  const walletId = wallet.getWalletId(data.seed);
  const address = coreApi.wallet.createAddress(data.seed);
  return Promise.all([
    wallet.setSeed(data.seed, data.password),
    wallet.setAddressForWalletId(walletId, address)
  ])
    .then(() => wallet.setActiveWallet(walletId))
    .then(() => emitter.emit('create-wallet', { walletId }));
}

function openWallet ({ emitter }) {
  const activeWallet = wallet.getActiveWallet() || wallet.getWallets()[0];

  wallet.getAddressesForWalletId(activeWallet).forEach(address =>
    emitter.emit('open-wallets', {
      walletIds: [activeWallet],
      activeWallet,
      address
    })
  );
}

function refreshAllSockets ({ url }, { coreApi, emitter }) {
  emitter.emit('sockets-scan-started', {});
  return coreApi.sockets.getConnections()
    .then(function () {
      emitter.emit('sockets-scan-finished', { success: true });
      return {};
    })
    .catch(function (error) {
      logger.warn('Could not sync sockets/connections', error.stack);
      emitter.emit('sockets-scan-finished', {
        error: error.message,
        success: false
      });
      // emitter.once('coin-block', () =>
      //   refreshAllTransactions({ address }, { coreApi, emitter })
      // );
      return {};
    });
}

function refreshAllTransactions ({ address }, { coreApi, emitter }) {
  emitter.emit('transactions-scan-started', {});
  return coreApi.explorer.refreshAllTransactions(address)
    .then(function () {
      emitter.emit('transactions-scan-finished', { success: true });
      return {};
    })
    .catch(function (error) {
      logger.warn('Could not sync transactions/events', error.stack);
      emitter.emit('transactions-scan-finished', {
        error: error.message,
        success: false
      });
      emitter.once('coin-block', () =>
        refreshAllTransactions({ address }, { coreApi, emitter })
      );
      return {};
    });
}

function refreshTransaction ({ hash, address }, { coreApi }) {
  return pTimeout(
    coreApi.explorer.refreshTransaction(hash, address),
    config.scanTransactionTimeout
  )
    .then(() => ({ success: true }))
    .catch(error => ({ error, success: false }));
}

const getGasLimit = (data, { coreApi }) => coreApi.wallet.getGasLimit(data);

const getGasPrice = (data, { coreApi }) => coreApi.wallet.getGasPrice(data);

const sendLmr = (data, { coreApi }) =>
  withAuth(coreApi.lumerin.sendLmr)(data, { coreApi });

module.exports = {
  refreshAllSockets,
  refreshAllTransactions,
  refreshTransaction,
  createWallet,
  getGasLimit,
  getGasPrice,
  openWallet,
  sendLmr
};
