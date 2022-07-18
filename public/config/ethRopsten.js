'use strict';

const LumerinContracts = require('@lumerin/contracts');
const { Lumerin, CloneFactory, Implementation } = LumerinContracts['ropsten'];

const indexerUrl = process.env.ROPSTEN_INDEXER_URL || 'http://localhost:3005';
const wsApiUrl = process.env.ROPSTEN_NODE_URL || 'wss://ropsten.infura.io/ws/v3/4b68229d56fe496e899f07c3d41cb08a' || 'ws://localhost:8546';

module.exports = {
  displayName: 'Ropsten',
  chainId: '3',
  symbol: 'LMR',

  // contract addresses
  lmrTokenAddress: Lumerin.address,
  cloneFactoryAddress: CloneFactory.address,
  // webFacingAddress: WebFacing.address,
  ImplementationAddress: Implementation.address,

  // urls
  proxyRouterUrl: process.env.PROXY_ROUTER_BASE_URL || 'proxyrouter.stg.lumerin.io:8080' || 'localhost:8080',
  explorerUrl: 'https://ropsten.etherscan.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defauls
  coinDefaultGasLimit: '999999',
  lmrDefaultGasLimit: '999999',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};