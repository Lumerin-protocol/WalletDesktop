const PROXY_ROUTER_MODE = {
  Buyer: "buyer",
  Seller: "seller",
};

const getProxyRouterEnvs = (config, mode) => {
  const modes = {
    [PROXY_ROUTER_MODE.Buyer]: [
      ["PROXY_ADDRESS", `0.0.0.0:${config.buyerProxyPort}`],
      ["WEB_ADDRESS", `0.0.0.0:${config.buyerWebPort}`],
      ["IS_BUYER", true],
      ["POOL_ADDRESS", `"${config.buyerDefaultPool}"`],
      ["HASHRATE_DIFF_THRESHOLD", 0.1],
    ],
    [PROXY_ROUTER_MODE.Seller]: [
      ["PROXY_ADDRESS", `0.0.0.0:${config.sellerProxyPort}`],
      ["WEB_ADDRESS", `0.0.0.0:${config.sellerWebPort}`],
      ["IS_BUYER", false],
      ["POOL_ADDRESS", `"${config.sellerDefaultPool}"`],
      ["HASHRATE_DIFF_THRESHOLD", 0.03],
    ],
  };
  return [
    ["CLONE_FACTORY_ADDRESS", `"${config.cloneFactoryAddress}"`],
    ["ETH_NODE_ADDRESS", `"${config.wsApiUrl}"`],
    ["MINER_VETTING_DURATION", "1m"],
    ["POOL_CONN_TIMEOUT", "15m"],
    ["POOL_MAX_DURATION", "7m"],
    ["POOL_MIN_DURATION", "2m"],
    ["STRATUM_SOCKET_BUFFER_SIZE", 4],
    ["VALIDATION_BUFFER_PERIOD", "10m"],
    ["WALLET_ADDRESS", `"${config.walletAddress}"`],
    ["WALLET_PRIVATE_KEY", `"${config.privateKey}"`],
    ["LOG_LEVEL", "debug"],
    ["MINER_SUBMIT_ERR_LIMIT", 0],
    ...(modes[mode] || []),
  ];
};

module.exports = { getProxyRouterEnvs, PROXY_ROUTER_MODE };
