'use strict';

module.exports = {
  displayName: 'Ethereum',
  chainId: 1,
  symbol: 'ETH',

  // contracts addresses
  lmrTokenAddress: "0x4b1d0b9f081468d780ca1d5d79132b64301085d1",
  cloneFactoryAddress: null,
  webFacingAddress: null,

  // urls
  proxyRouterUrl: 'http://localhost:8080',
  explorerUrl: 'https://etherscan.io/tx/{{hash}}',
  indexerUrl: 'https://indexer.metronome.io',
  wsApiUrl: 'wss://eth.wallet.metronome.io:8546',

  // defauls
  coinDefaultGasLimit: '21000',
  lmrDefaultGasLimit: '250000',
  defaultGasPrice: '1000000000',
  maxGasPrice: '20000000000000000'
};
