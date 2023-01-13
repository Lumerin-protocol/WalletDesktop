import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';

import * as utils from '../utils';
import { getChain, getRate } from './chain';
import { getConfig } from './config';
import { getIsOnline } from './connectivity';
import { getEthBalance, getLmrBalance } from '../utils/coinValue';
import { toUSD } from '../utils/syncAmounts';

export const getWallet = createSelector(
  getChain,
  chainData => chainData.wallet
);

// Returns the Wallet address
export const getWalletAddress = createSelector(
  getWallet,
  walletData => walletData.address
);

// Returns the LMR balance of the active address in wei
export const getWalletEthBalance = createSelector(
  getWallet,
  walletData => getEthBalance(walletData.ethBalance)
  // (walletData) => walletData.ethBalance / lmrEightDecimals
);

// Returns the LMR balance of the active address in wei
export const getWalletLmrBalance = createSelector(getWallet, walletData =>
  getLmrBalance(get(walletData, 'token.lmrBalance', 0))
);

export const getWalletLmrBalanceUSD = createSelector(
  getWalletLmrBalance,
  getRate,
  (lmrBalance, rate) => toUSD(lmrBalance, rate)
);

// Returns the LMR balance of the active address in wei
export const getLmrBalanceWei = getWalletLmrBalance;

// TODO implement when we have a definition about LMR:USD rate
// export const getLmrRateUSD = createSelector(chainData => chainData.wallet)

// Returns the array of transactions of the current chain/wallet/address.
// The items are mapped to contain properties useful for rendering.
export const getTransactions = createSelector(getWallet, walletData => {
  const transactionParser = utils.createTransactionParser(walletData.address);

  const transactions = get(walletData, 'token.transactions', []);

  const sorted = sortBy(transactions, [
    'transaction.blockNumber',
    'transaction.transactionIndex',
    'transaction.nonce'
  ]).reverse();

  const mapped = sorted.map(transactionParser);

  return mapped;
});

// Returns if the current wallet/address has transactions on the active chain
export const hasTransactions = createSelector(
  getTransactions,
  transactions => transactions.length !== 0
);

// Returns wallet transactions sync status on the active chain
export const getTxSyncStatus = createSelector(
  getWallet,
  walletData => walletData.syncStatus
);

// Returns the status of the "Send Lumerin" feature on the chain
export const sendLmrFeatureStatus = createSelector(
  getWalletLmrBalance,
  getIsOnline,
  (lmrBalance, isOnline) =>
    isOnline ? (utils.hasFunds(lmrBalance) ? 'ok' : 'no-funds') : 'offline'
);

// Returns the status of the "Receive Lumerin" feature on the chain
export const receiveLmrFeatureStatus = createSelector(
  getWalletLmrBalance,
  getIsOnline,
  (lmrBalance, isOnline) =>
    isOnline ? (utils.hasFunds(lmrBalance) ? 'ok' : 'no-funds') : 'offline'
);

// Returns the status of the "Retry Import" feature on the chain
export const retryImportLmrFeatureStatus = createSelector(
  getIsOnline,
  getConfig,
  (isOnline, config) =>
    config.chain.chainId ? (isOnline ? 'ok' : 'no-coin') : 'offline'
);

export const getMergedTransactions = createSelector(
  getChain,
  chain => chain.wallet.token.transactions
);

// Returns a transaction object given a transaction hash
export const getTransactionFromHash = createSelector(
  getTransactions,
  getWalletAddress,
  props => props.hash,
  (transactions, activeAddress, hash) =>
    transactions
      .map(utils.createTransactionParser(activeAddress))
      .find(tx => tx.hash === hash)
);
