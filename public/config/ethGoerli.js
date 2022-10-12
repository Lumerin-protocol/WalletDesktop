'use strict';

const LumerinContracts = require('@lumerin/contracts');
const { Lumerin, CloneFactory, Implementation } = LumerinContracts['goerli'];

const indexerUrl = process.env.ROPSTEN_INDEXER_URL || 'http://localhost:3005';
const wsApiUrl = process.env.ROPSTEN_NODE_URL || 'wss://goerli.infura.io/ws/v3/91fa8dea25fe4bf4b8ce1c6be8bb9eb3' || 'ws://localhost:8546';

module.exports = {
  displayName: 'Goerli',
  chainId: '420',
  symbol: 'ETH',

  // contract addresses
  lmrTokenAddress: Lumerin.address,
  cloneFactoryAddress: CloneFactory.address,
  // webFacingAddress: WebFacing.address,
  ImplementationAddress: Implementation.address,

  // urls
  proxyRouterUrl: process.env.PROXY_ROUTER_BASE_URL || 'proxyrouter.stg.lumerin.io:8080' || 'localhost:8080',
  explorerUrl: 'https://goerli.etherscan.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defauls
  coinDefaultGasLimit: '999999',
  lmrDefaultGasLimit: '999999',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};