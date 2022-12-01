'use strict';

const chain = {
  displayName: process.env.DISPLAY_NAME,
  chainId: process.env.CHAIN_ID,
  symbol: process.env.SYMBOL,

  lmrTokenAddress: process.env.LUMERIN_TOKEN_ADDRESS,
  cloneFactoryAddress: process.env.CLONE_FACTORY_ADDRESS,

  // proxyRouterUrl: process.env.PROXY_ROUTER_URL,
  proxyRouterUrl: 'http://localhost:8081',
  explorerUrl: process.env.EXPLORER_URL,
  wsApiUrl: process.env.ETH_NODE_ADDRESS,

  coinDefaultGasLimit: process.env.COIN_DEFAULT_GAS_LIMIT,
  lmrDefaultGasLimit: process.env.LMR_DEFAULT_GAS_LIMIT,
  defaultGasPrice: process.env.DEFAULT_GAS_PRICE,
  maxGasPrice: process.env.MAX_GAS_PRICE,
}

module.exports = {
  chain,
  dbAutocompactionInterval: 30000,
  debug: process.env.DEBUG === 'true' || false,
  explorerDebounce: 2000,
  ratesUpdateMs: 30000,
  requiredPasswordEntropy: parseInt(process.env.REQUIRED_PASSWORD_ENTROPY || '72', 10),
  scanTransactionTimeout: 240000,
  sentryDsn: process.env.SENTRY_DSN,
  statePersistanceDebounce: 2000,
  trackingId: process.env.TRACKING_ID,
  web3Timeout: 120000
};
