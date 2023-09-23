const { parseJSONArray } = require('./utils')

let httpApiUrls

try {
  httpApiUrls = parseJSONArray(process.env.ETH_NODE_ADDRESS_HTTP)
} catch (err) {
  throw new Error(`Invalid ETH_NODE_ADDRESS_HTTP: ${err?.message}`);
}


const chain = {
  displayName: process.env.DISPLAY_NAME,
  chainId: process.env.CHAIN_ID,
  symbol: process.env.SYMBOL_LMR || process.env.SYMBOL || 'LMR',
  symbolEth: process.env.SYMBOL_ETH || 'ETH',

  lmrTokenAddress: process.env.LUMERIN_TOKEN_ADDRESS,
  cloneFactoryAddress: process.env.CLONE_FACTORY_ADDRESS,
  faucetAddress: process.env.FAUCET_ADDRESS || '0xFE64cAE7Ca5166c8bb0e014e2D402f8d22764f24',

  proxyRouterUrl: process.env.PROXY_ROUTER_URL,
  explorerUrl: process.env.EXPLORER_URL,
  wsApiUrl: process.env.ETH_NODE_ADDRESS,
  httpApiUrls: httpApiUrls,
  ipLookupUrl: process.env.IP_LOOKUP_URL,

  coinDefaultGasLimit: process.env.COIN_DEFAULT_GAS_LIMIT,
  lmrDefaultGasLimit: process.env.LMR_DEFAULT_GAS_LIMIT,
  defaultGasPrice: process.env.DEFAULT_GAS_PRICE,
  maxGasPrice: process.env.MAX_GAS_PRICE,

  proxyPort: process.env.PROXY_DEFAULT_PORT || 3333,
  proxyWebPort: process.env.PROXY_WEB_DEFAULT_PORT || 8081,

  localProxyRouterUrl: `http://localhost:${process.env
    .SPROXY_WEB_DEFAULT_PORT || 8081}`,

  faucetUrl: process.env.FAUCET_URL,
  showFaucet: process.env.SHOW_FAUCET === "true",

  titanLightningPool: process.env.TITAN_LIGHTNING_POOL,
  defaultSellerCurrency: process.env.DEFAULT_SELLER_CURRENCY || 'BTC',

  bypassAuth: process.env.BYPASS_AUTH === "true",
};

module.exports = {
  chain,
  dbAutocompactionInterval: 30000,
  debug: process.env.DEBUG === "true" && process.env.IGNORE_DEBUG_LOGS !== "true",
  devTools: process.env.DEV_TOOLS === "true",
  explorerDebounce: 2000,
  ratesUpdateMs: 30000,
  scanTransactionTimeout: 240000,
  sentryDsn: process.env.SENTRY_DSN,
  statePersistanceDebounce: 2000,
  trackingId: process.env.TRACKING_ID,
  web3Timeout: 120000,
  recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
};
