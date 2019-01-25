'use strict'

const subscriptions = require('./subscriptions')
const { createCore } = require('metronome-wallet-core')
const { ipcMain } = require('electron')
const logger = require('electron-log')
const settings = require('./settings')
const storage = require('./storage')

function startCore ({ chain, core }) {
  const { emitter, events, api: coreApi } = core.start()

  emitter.setMaxListeners(15)

  events.push('create-wallet', 'open-wallets')

  let webContent = null

  function send (eventName, data) {
    if (!webContent) {
      return
    }
    webContent.send(eventName, Object.assign({}, data, { chain }))
  }

  events.forEach(event =>
    emitter.on(event, function (data) {
      send(event, data)
    })
  )

  function syncTransactions ({ address }) {
    storage.getSyncBlock(chain)
      .then(function (from) {
        send('transactions-scan-started', { data: {} })

        return coreApi.explorer
          .syncTransactions(from, address)
          .then(number => storage.setSyncBlock(number, chain))
          .then(function () {
            send('transactions-scan-finished', { data: { success: true } })

            emitter.on('coin-block', function ({ number }) {
              storage.setSyncBlock(number, chain).catch(function (err) {
                logger.warn('Could not save new synced block', err)
              })
            })
          })
      })
      .catch(function (err) {
        logger.warn('Could not sync transactions/events', err.stack)
        send('transactions-scan-finished', { data: { err, success: false } })

        emitter.once('coin-block', () =>
          syncTransactions({ address })
        )
      })
  }

  emitter.on('open-wallets', syncTransactions)

  emitter.on('wallet-error', function (err) {
    logger.warn(err.inner
      ? `${err.message} - ${err.inner.message}`
      : err.message
    )
  })

  ipcMain.on('ui-ready', function (e) {
    webContent = e.sender
    webContent.on('destroyed', function () {
      webContent = null
    })
  })

  ipcMain.on('ui-unload', function () {
    webContent = null
  })

  return {
    emitter,
    events,
    coreApi
  }
}

function createClient (config) {
  ipcMain.on('log.error', function (_, args) {
    logger.error(args.message)
  })

  settings.presetDefaults()

  ipcMain.on('ui-ready', function (webContent, args) {
    const onboardingComplete = !!settings.getPasswordHash()
    storage.getState()
      .catch(function (err) {
        logger.warn('Faild to get state', err.message)
        return {}
      })
      .then(function (persistedState) {
        webContent.sender.send(
          'ui-ready',
          Object.assign({}, args, {
            data: {
              onboardingComplete,
              persistedState: persistedState || {},
              config
            }
          })
        )
      })
      .catch(function (err) {
        logger.error('Could not send ui-ready message back', err.message)
      })
  })

  const cores = config.enabledChains.map(chainName => ({
    chain: chainName,
    core: createCore(Object.assign({}, config.chains[chainName], config))
  }))

  cores.forEach(function (core) {
    const { emitter, events, coreApi } = startCore(core)
    core.emitter = emitter
    core.events = events
    core.coreApi = coreApi
  })

  subscriptions.subscribe(cores)
}

module.exports = { createClient }
