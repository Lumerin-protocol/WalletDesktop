'use strict';

const indexerUrl = process.env.ROPSTEN_INDEXER_URL || 'http://localhost:3005';
const wsApiUrl = process.env.ROPSTEN_NODE_URL || 'wss://goerli.infura.io/ws/v3/91fa8dea25fe4bf4b8ce1c6be8bb9eb3' || 'ws://localhost:8546';

module.exports = {
  displayName: 'Goerli',
  chainId: '5',
  symbol: 'ETH',

  // contract addresses
  lmrTokenAddress: "0xF3aCe2847F01D3ef1025c7070579611091A6422D",
  cloneFactoryAddress: "0xbF2A6EA18e2CF0846cE7FC9Fa9EB9bA22BF035fF",
  implementationAddress: null,
  webFacingAddress: null,

  // urls
  proxyRouterBaseUrl: process.env.PROXY_ROUTER_BASE_URL || 'proxyrouter.stg.lumerin.io:8080' || 'localhost:8080',
  explorerUrl: 'https://goerli.etherscan.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defauls
  coinDefaultGasLimit: '999999',
  lmrDefaultGasLimit: '999999',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};