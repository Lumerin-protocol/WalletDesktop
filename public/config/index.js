'use strict';

const enabledChain = (process.env.ENABLED_CHAIN || 'ethRopsten');

const chain = require(`./${enabledChain}`);

module.exports = {
  chain,
  dbAutocompactionInterval: 30000,
  debug: process.env.DEBUG || false,
  enabledChain,
  explorerDebounce: 2000,
  ratesUpdateMs: 30000,
  requiredPasswordEntropy: parseInt(process.env.REQUIRED_PASSWORD_ENTROPY || '72', 10),
  scanTransactionTimeout: 240000,
  sentryDsn: process.env.SENTRY_DSN,
  statePersistanceDebounce: 2000,
  trackingId: process.env.TRACKING_ID,
  web3Timeout: 120000
};
