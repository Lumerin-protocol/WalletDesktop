'use strict';

const { flatten } = require('lodash')

const auth = require('../auth')
const config = require('../../../config')
const keys = require('../keys')
const wallet = require('../wallet')
const WalletError = require('../WalletError')

const noCore = require('./no-core')
const singleCore = require('./single-core')

const createWallets = (data, cores, openWallets = true) =>
  Promise.all([
    cores.forEach(core =>
      singleCore
        .createWallet(data, core)
        .then(() => openWallets && singleCore.openWallet(core))
    )
  ])

const onboardingCompleted = (data, cores) =>
  auth.setPassword(data.password).then(() =>
    createWallets(
      {
        seed: keys.mnemonicToSeedHex(data.mnemonic),
        password: data.password
      },
      cores
    )
  )

const recoverFromMnemonic = function (data, cores) {
  if (!auth.isValidPassword(data.password)) {
    return null;
  }

  wallet.clearWallets();

  return createWallets(
    { seed: keys.mnemonicToSeedHex(data.mnemonic), password: data.password },
    cores,
    false
  ).then(noCore.clearCache);
}

function onLoginSubmit (data, cores) {
  return auth.isValidPassword(data.password).then(function (isValid) {
    if (!isValid) {
      return { error: new WalletError('Invalid password') };
    }
    cores.forEach(singleCore.openWallet);
    return isValid;
  })
}

const findCoreByChainName = (cores, chain) => cores.find(e => e.chain === chain);

const findCoreBySymbol = (cores, ticker) =>
  cores.find(e => e.config.symbol === ticker);

function getPortFees (data, cores) {
  const exportCore = findCoreByChainName(cores, data.chain);
  return singleCore
    .getExportLmrFee(data, exportCore)
    .then(fee =>
      singleCore
        .getExportGasLimit(Object.assign({}, data, { fee }), exportCore)
        .then(({ gasLimit }) => ({ exportGasLimit: gasLimit, fee }))
    )
}

const withMerkleRoot = fn =>
  function (data, cores) {
    const exportCore = findCoreBySymbol(cores, data.originChain)
    const importCore = findCoreByChainName(cores, data.chain)
    return singleCore
      .getMerkleRoot(data.burnSequence, exportCore)
      .then(function (root) {
        const importData = Object.assign({}, data, { root })
        return fn(importData, importCore)
      })
  }

const importLumerin = (data, cores) =>
  withMerkleRoot(singleCore.importLumerin)(data, cores)

const getImportLmrGas = (data, cores) =>
  withMerkleRoot(singleCore.getImportGasLimit)(data, cores)

function portLumerin (data, cores) {
  const exportCore = findCoreByChainName(cores, data.chain)
  const exportData = Object.assign({}, data, {
    destinationChain: config.chains[data.destinationChain].symbol,
    destinationLmrAddress: config.chains[data.destinationChain].lmrTokenAddress,
    extraData: '0x00'
  })
  return singleCore
    .exportLumerin(exportData, exportCore)
    .then(function ({ receipt }) {
      const parsedExportReceipt = flatten(
        Object.keys(receipt.events)
          .filter(e => !receipt.events[e].event) // Filter already parsed event keys
          .map(e => receipt.events[e]) // Get not parsed events
          .map(e => exportCore.coreApi.explorer.tryParseEventLog(e)) // Try to parse each event
      ).find(e => e.parsed.event === 'LogExportReceipt') // Get LogExportReceipt event
      if (!parsedExportReceipt || !parsedExportReceipt.parsed) {
        return Promise.reject(
          new WalletError('There was an error trying to parse export receipt')
        )
      }
      const { returnValues } = parsedExportReceipt.parsed
      const importCore = findCoreByChainName(cores, data.destinationChain)
      const importData = {
        blockTimestamp: returnValues.blockTimestamp,
        burnSequence: returnValues.burnSequence,
        currentBurnHash: returnValues.currentBurnHash,
        currentTick: returnValues.currentTick,
        dailyMintable: returnValues.dailyMintable,
        destinationChain: config.chains[data.destinationChain].symbol,
        destinationLmrAddress: returnValues.destinationLumerinAddr,
        extraData: returnValues.extraData,
        fee: returnValues.fee,
        from: data.from,
        originChain: config.chains[data.chain].symbol,
        previousBurnHash: returnValues.prevBurnHash,
        supply: returnValues.supplyOnAllChains,
        value: returnValues.amountToBurn,
        password: data.password,
        walletId: data.walletId
      }
      return singleCore
        .getMerkleRoot(returnValues.burnSequence, exportCore)
        .then(function (root) {
          Object.assign(importData, { root })
          return singleCore
            .getImportGasLimit(importData, importCore)
            .then(({ gasLimit }) =>
              singleCore.importLumerin(
                Object.assign({}, importData, { gas: gasLimit }),
                importCore
              )
            )
            .catch(e => Promise.reject(new WalletError(e.message)))
        })
    })
}

module.exports = {
  onboardingCompleted,
  recoverFromMnemonic,
  importLumerin,
  getImportLmrGas,
  portLumerin,
  onLoginSubmit,
  getPortFees
}
