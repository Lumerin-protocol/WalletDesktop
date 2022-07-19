'use strict';

const { ipcMain } = require('electron');
const createCore = require('@lumerin/wallet-core');
const stringify = require('json-stringify-safe');

const logger = require('../../logger');
const subscriptions = require('./subscriptions');
const settings = require('./settings');
const storage = require('./storage');

function startCore ({ chain, core, config: coreConfig }, webContent) {
  logger.verbose(`Starting core ${chain}`);
  const { emitter, events, api } = core.start(coreConfig);

  // emitter.setMaxListeners(30);
  emitter.setMaxListeners(50);

  events.push(
    'create-wallet',
    'transactions-scan-started',
    'transactions-scan-finished',
    'contracts-scan-started',
    'contracts-scan-finished'
  );

  function send (eventName, data) {
    if (!webContent) {
      return;
    }
    const payload = Object.assign({}, data, { chain });
    webContent.sender.send(eventName, payload);
    logger.verbose(`<-- ${eventName} ${stringify(payload)}`);
  }

  events.forEach(event =>
    emitter.on(event, function (data) {
      send(event, data);
    })
  );

  function syncTransactions ({ address }) {
    return storage
      .getSyncBlock(chain)
      .then(function (from) {
        send('transactions-scan-started', {});

        return api.explorer
          .syncTransactions(from, address, number => storage.setSyncBlock(number, chain))
          .then(function () {
            send('transactions-scan-finished', { success: true });

            emitter.on('coin-block', function ({ number }) {
              storage.setSyncBlock(number, chain)
                .catch(function (err) {
                  logger.warn('Could not save new synced block', err);
                });
            });
          });
      })
      .catch(function (err) {
        logger.warn('Could not sync transactions/events', err.stack);
        send('transactions-scan-finished', {
          error: err.message,
          success: false
        });

        emitter.once('coin-block', () =>
          syncTransactions({ address })
        );
      });
  }

  emitter.on('open-wallet', syncTransactions)

  emitter.on('wallet-error', function (err) {
    logger.warn(err.inner
      ? `${err.message} - ${err.inner.message}`
      : err.message
    );
  });

  return {
    emitter,
    events,
    api
  };
}

function stopCore ({ core, chain }) {
  logger.verbose(`Stopping core ${chain}`);
  core.stop();
}

function createClient (config) {
  ipcMain.on('log.error', function (_, args) {
    logger.error(args.message);
  });

  settings.presetDefaults();

  let core = {
    chain: config.enabledChain,
    core: createCore(),
    config: Object.assign({}, config.chain, config)
  };

  ipcMain.on('ui-ready', function (webContent, args) {
    const onboardingComplete = !!settings.getPasswordHash();

    storage.getState()
      .catch(function (err) {
        logger.warn('Failed to get state', err.message);
        return {};
      })
      .then(function (persistedState) {
        const payload = Object.assign({}, args, {
          data: {
            onboardingComplete,
            persistedState: persistedState || {},
            config
          }
        });
        webContent.sender.send('ui-ready', payload);
        logger.verbose(`<-- ui-ready ${stringify(payload)}`);
      })
      .catch(function (err) {
        logger.error('Could not send ui-ready message back', err.message);
      })
      .then(function () {
        const { emitter, events, api } = startCore(core, webContent);
        core.emitter = emitter;
        core.events = events;
        core.api = api;
        subscriptions.subscribe(core);
      })
      .catch(function (err) {
        console.log('Unknown chain =', err.message)
        logger.error('Could not start core', err.message);
      });
  });

  ipcMain.on('ui-unload', function () {
    stopCore(core);
    subscriptions.unsubscribe(core);
  });
}

module.exports = { createClient };
