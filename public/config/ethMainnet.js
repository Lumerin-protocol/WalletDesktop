'use strict';

const LumerinContracts = require('metronome-contracts')
const contracts = LumerinContracts['mainnet'];

module.exports = {
  displayName: 'Ethereum',
  chainId: 1,
  symbol: 'ETH',

  // contracts addresses
  tokenPorterAddress: contracts.TokenPorter.address,
  converterAddress: contracts.AutonomousConverter.address,
  validatorAddress: contracts.Validator.address,
  lmrTokenAddress: contracts.METToken.address,
  auctionAddress: contracts.Auctions.address,

  // urls
  explorerUrl: 'https://etherscan.io/tx/{{hash}}',
  indexerUrl: 'https://indexer.metronome.io',
  wsApiUrl: 'wss://eth.wallet.metronome.io:8546',

  // defauls
  coinDefaultGasLimit: '21000',
  lmrDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};
