'use strict';

const LumerinContracts = require('@lumerin/contracts');
const { Lumerin, WebFacing } = LumerinContracts['1337'];

module.exports = {
  displayName: 'Lumerin',
  chainId: '1337',
  symbol: 'LMR',

  // contracts addresses
  lmrTokenAddress: Lumerin.address,
  // webfacingAddress: WebFacing.address,

  // urls
  explorerUrl: 'https://etherscan.io/tx/{{hash}}',
  indexerUrl: 'https://indexer.metronome.io',
  // wsApiUrl: 'wss://eth.wallet.metronome.io:8546',
  wsApiUrl: 'ws://3.217.127.193:8545',

  // defauls
  coinDefaultGasLimit: '21000',
  lmrDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};
