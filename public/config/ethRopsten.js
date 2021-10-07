'use strict';

const LumerinContracts = require('metronome-contracts');
const contracts = LumerinContracts['ropsten'];

const indexerUrl = process.env.ROPSTEN_INDEXER_URL || 'http://localhost:3005';
const wsApiUrl = process.env.ROPSTEN_NODE_URL || 'ws://localhost:8546';

module.exports = {
  displayName: 'Ropsten',
  chainId: 3,
  symbol: 'ETH',

  // contracts addresses
  tokenPorterAddress: contracts.TokenPorter.address,
  converterAddress: contracts.AutonomousConverter.address,
  validatorAddress: contracts.Validator.address,
  lmrTokenAddress: contracts.METToken.address,
  auctionAddress: contracts.Auctions.address,

  // urls
  explorerUrl: 'https://ropsten.etherscan.io/tx/{{hash}}',
  indexerUrl,
  wsApiUrl,

  // defauls
  coinDefaultGasLimit: '21000',
  lmrDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};
