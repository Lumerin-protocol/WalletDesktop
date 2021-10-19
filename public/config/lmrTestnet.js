'use strict';

const LumerinContracts = require('lumerin-contracts');
const { LMRToken } = LumerinContracts['1337'];

console.log('LumerinContract - [chainId] - lmrTestnet.js: ', LumerinContracts['1337']);
module.exports = {
  displayName: 'Lumerin',
  chainId: '1337',
  symbol: 'ETH',

  // contracts addresses
  lmrTokenAddress: LMRToken.address,

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
