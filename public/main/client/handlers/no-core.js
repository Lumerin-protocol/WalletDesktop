"use strict";

const restart = require("../electron-restart");
const dbManager = require("../database");
const logger = require("../../../logger");
const storage = require("../storage");
const auth = require("../auth");
const wallet = require("../wallet");
const {
  setProxyRouterConfig,
  getProxyRouterConfig,
  getDefaultCurrencySetting,
  setDefaultCurrencySetting,
  getKey,
  setKey
} = require("../settings");
const validatePassword = (data) => auth.isValidPassword(data);

function clearCache() {
  logger.verbose("Clearing database cache");
  return dbManager
    .getDb()
    .dropDatabase()
    .then(restart);
}

const persistState = (data) => storage.persistState(data).then(() => true);

function changePassword({ oldPassword, newPassword }) {
  return validatePassword(oldPassword).then(function (isValid) {
    if (!isValid) {
      return isValid;
    }
    return auth.setPassword(newPassword).then(function () {
      const seed = wallet.getSeed(oldPassword);
      wallet.setSeed(seed, newPassword);

      return true;
    });
  });
}

const saveProxyRouterSettings = (data) =>
  Promise.resolve(setProxyRouterConfig(data));

const getProxyRouterSettings = async () => {
  return getProxyRouterConfig();
};

const handleClientSideError = (data) => {
  logger.error("client-side error", data.message, data.stack);
}

const getDefaultCurrency = async () => getDefaultCurrencySetting();
const setDefaultCurrency = async (curr) => setDefaultCurrencySetting(curr);

const getCustomEnvs = async () => getKey('customEnvs');
const setCustomEnvs = async (value) => setKey('customEnvs', value);

const restartWallet = () => restart(1);

module.exports = {
  validatePassword,
  changePassword,
  persistState,
  clearCache,
  saveProxyRouterSettings,
  getProxyRouterSettings,
  handleClientSideError,
  getDefaultCurrency,
  setDefaultCurrency,
  getCustomEnvs,
  setCustomEnvs,
  restartWallet,
};
