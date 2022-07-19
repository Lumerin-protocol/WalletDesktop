'use strict';

const { aes256cbcIv, sha256 } = require('./crypto');
const settings = require('electron-settings');

const getWallet = () => Object.keys(settings.getSync('user.wallet'));

const getAddress = () => settings.getSync(`user.wallet.address`);

const getToken = () => settings.getSync(`user.wallet.token`);

function getSeed (password) {
  const encryptedSeed = settings.getSync(`user.wallet.encryptedSeed`);
  return aes256cbcIv.decrypt(password, encryptedSeed);
}

const setAddress = (address) => settings.setSync(`user.wallet.address`, { address });

const setSeed = (seed, password) => settings.setSync(`user.wallet.encryptedSeed`, aes256cbcIv.encrypt(password, seed));

const clearWallet = () => settings.setSync('user.wallet', {});

module.exports = {
  getAddress,
  setAddress,
  getActiveWallet: getWallet,
  setActiveWallet: setAddress,
  clearWallet,
  getWallet,
  getToken,
  getSeed,
  setSeed
};
