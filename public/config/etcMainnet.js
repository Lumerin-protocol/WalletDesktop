'use strict';

const LumerinContracts = require('@lumerin/contracts');
const { Lumerin, WebFacing } = LumerinContracts['classic'];

module.exports = {
  displayName: 'Ethereum Classic',
  chainId: 61,
  symbol: 'ETC',

  // contracts addresses
  lmrTokenAddress: Lumerin.address,
  webfacingAddress: WebFacing.address,

  // urls
  explorerUrl: 'https://blockscout.com/etc/mainnet/tx/{{hash}}/internal_transactions',
  indexerUrl: 'https://etc.indexer.metronome.io',
  wsApiUrl: 'wss://etc.wallet.metronome.io:8546',

  // defauls
  coinDefaultGasLimit: '21000',
  lmrDefaultGasLimit: '250000',
  defaultGasPrice: '10000000000',
  maxGasPrice: '200000000000000000'
};
