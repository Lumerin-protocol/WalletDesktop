'use strict';

const LumerinContracts = require('@lumerin/contracts');
const { Lumerin, WebFacing } = LumerinContracts['mordor'];

const indexerUrl = process.env.MORDOR_INDEXER_URL || 'http://localhost:3015';
const wsApiUrl = process.env.MORDOR_NODE_URL || 'ws://localhost:8556';

module.exports = {
  displayName: 'Mordor',
  chainId: 63,
  symbol: 'ETC',

  // contracts addresses
  lmrTokenAddress: Lumerin.address,
  webfacingAddress: WebFacing.address,

  // urls
  explorerUrl: 'https://mordorexplorer.ethernode.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defauls
  coinDefaultGasLimit: '21000',
  lmrDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};
