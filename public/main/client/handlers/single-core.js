"use strict";

const pTimeout = require("p-timeout");
const logger = require("../../../logger");
const auth = require("../../../../src/client/auth");
const keys = require("../keys");
const config = require("../../../config");
const wallet = require("../wallet");
const noCore = require("./no-core");
const WalletError = require("../WalletError");

const withAuth = (fn) => (data, { api }) => {
  if (typeof data.walletId !== "string") {
    throw new WalletError("walletId is not defined");
  }

  return auth
    .isValidPassword(data.password)
    .then(() => {
      return wallet.getSeed(data.password);
    })
    .then((seed, index) => {
      return api.wallet.createPrivateKey(seed, index);
    })
    .then((privateKey) => fn(privateKey, data));
};

const createContract = async function(data, { api }) {
  data.walletId = wallet.getAddress().address;
  data.password = await auth.getSessionPassword();

  if (typeof data.walletId !== "string") {
    throw new WalletError("WalletId is not defined");
  }
  return withAuth((privateKey) =>
    api.contracts.createContract({
      price: data.price,
      speed: data.speed,
      duration: data.duration,
      sellerAddress: data.sellerAddress,
      password: data.password,
      privateKey,
    })
  )(data, { api });
};

function createWallet(data, core, isOpen = true) {
  const walletAddress = core.api.wallet.createAddress(data.seed);
  return Promise.all([
    wallet.setSeed(data.seed, data.password),
    wallet.setAddress(walletAddress),
  ])
    .then(() => core.emitter.emit("create-wallet", { address: walletAddress }))
    .then(() => isOpen && openWallet(core));
}

async function openWallet({ emitter }) {
  const { address } = wallet.getAddress();

  emitter.emit("open-wallet", { address, isActive: true });
}

const onboardingCompleted = (data, core) => {
  return auth
    .setPassword(data.password)
    .then(() =>
      createWallet(
        {
          seed: keys.mnemonicToSeedHex(data.mnemonic),
          password: data.password,
        },
        core,
        true
      )
    )
    .then(() => true)
    .catch((err) => {
      error: new WalletError("Onboarding unable to be completed: ", err);
    });
};

const recoverFromMnemonic = function(data, core) {
  if (!auth.isValidPassword(data.password)) {
    return null;
  }

  wallet.clearWallet();

  return createWallet(
    {
      seed: keys.mnemonicToSeedHex(data.mnemonic),
      password: data.password,
    },
    core,
    false
  )
    .then(noCore.clearCache)
    .then((_) => auth.setSessionPassword(data.password));
};

function onLoginSubmit({ password }, core) {
  return auth.isValidPassword(password).then(function(isValid) {
    if (!isValid) {
      return { error: new WalletError("Invalid password") };
    }
    openWallet(core);

    return isValid;
  });
}
function refreshAllSockets({ url }, { api, emitter }) {
  emitter.emit("sockets-scan-started", {});
  return api.sockets
    .getConnections()
    .then(function() {
      emitter.emit("sockets-scan-finished", { success: true });
      return {};
    })
    .catch(function(error) {
      logger.warn("Could not sync sockets/connections", error.stack);
      emitter.emit("sockets-scan-finished", {
        error: error.message,
        success: false,
      });
      // emitter.once('coin-block', () =>
      //   refreshAllTransactions({ address }, { api, emitter })
      // );
      return {};
    });
}

function refreshAllTransactions({ address }, { api, emitter }) {
  emitter.emit("transactions-scan-started", {});
  return api.explorer
    .refreshAllTransactions(address)
    .then(function() {
      emitter.emit("transactions-scan-finished", { success: true });
      return {};
    })
    .catch(function(error) {
      logger.warn("Could not sync transactions/events", error.stack);
      emitter.emit("transactions-scan-finished", {
        error: error.message,
        success: false,
      });
      emitter.once("coin-block", () =>
        refreshAllTransactions({ address }, { api, emitter })
      );
      return {};
    });
}

function refreshAllContracts({}, { api }) {
  return api.contracts.refreshContracts();
}

function refreshTransaction({ hash, address }, { api }) {
  return pTimeout(
    api.explorer.refreshTransaction(hash, address),
    config.scanTransactionTimeout
  )
    .then(() => ({ success: true }))
    .catch((error) => ({ error, success: false }));
}

const getGasLimit = (data, { api }) => api.wallet.getGasLimit(data);

const getGasPrice = (data, { api }) => api.wallet.getGasPrice(data);

const sendLmr = async (data, { api }) =>
  withAuth(api.lumerin.sendLmr)(
    { ...data, walletId: wallet.getAddress().address, password: await auth.getSessionPassword() },
    { api }
  );

const sendEth = (data, { api }) => withAuth(api.wallet.sendEth)(data, { api });

module.exports = {
  // refreshAllSockets,
  refreshAllContracts,
  createContract,
  onboardingCompleted,
  recoverFromMnemonic,
  onLoginSubmit,
  refreshAllTransactions,
  refreshTransaction,
  createWallet,
  getGasLimit,
  getGasPrice,
  openWallet,
  sendLmr,
  sendEth,
};
