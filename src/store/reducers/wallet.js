import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';

export const initialState = {
  syncStatus: 'up-to-date',
  allowSendTransaction: true,
  isActive: false,
  address: '',
  ethBalance: 0,
  transactions: {},
  page: 1,
  pageSize: 15,
  hasNextPage: true,
  token: {
    contract: '',
    lmrBalance: 0,
    transactions: {},
    symbol: 'LMR'
  }
};

/**
 * Should filter transactions without receipt if we received ones
 */
const mergeTransactions = (stateTxs, payloadTxs) => {
  const txWithReceipts = payloadTxs.filter(tx => tx.receipt);
  const txMap = keyBy(txWithReceipts, item => item.transaction.hash);

  const newStateTxs = { ...stateTxs };

  for (const tx of txWithReceipts) {
    newStateTxs[tx.transaction.hash] = tx;

    // contract purchase emits 2 transactions with the same hash
    // as of now we merge corresponding amount values. Temporary fix, until refactoring trasactions totally
    const oldStateTx = stateTxs[tx.transaction.hash];
    if (oldStateTx) {
      if (newStateTxs[tx.transaction.hash].transaction.value) {
        newStateTxs[tx.transaction.hash].transaction.value = String(
          Number(oldStateTx.transaction.value) + Number(tx.transaction.value)
        );
      }

      if (newStateTxs[tx.transaction.hash].transaction.input.amount) {
        newStateTxs[tx.transaction.hash].transaction.input.amount = String(
          Number(oldStateTx.transaction.input.amount) +
            Number(tx.transaction.input.amount)
        );
      }

      if (newStateTxs[tx.transaction.hash].receipt.value) {
        newStateTxs[tx.transaction.hash].receipt.value = String(
          Number(oldStateTx.receipt.value) + Number(tx.receipt.value)
        );
      }
    }
  }
  return newStateTxs;
};

const reducer = handleActions(
  {
    'initial-state-received': (state, { payload }) => ({
      ...state,
      ...get(payload, 'wallet', initialState),
      token: get(payload, 'wallet.token', initialState.token)
    }),

    'create-wallet': (state, { payload }) => ({
      ...state,
      address: payload.address
    }),

    'open-wallet': (state, { payload }) => ({
      ...state,
      address: payload.address,
      isActive: payload.isActive
    }),

    'eth-balance-changed': (state, { payload }) => ({
      ...state,
      ethBalance: payload.ethBalance
    }),

    'token-balance-changed': (state, { payload }) => ({
      ...state,
      token: {
        ...state.token,
        lmrBalance: payload.lmrBalance
      }
    }),

    'token-contract-received': (state, { payload }) => ({
      ...state,
      token: {
        ...state.token,
        contract: payload.contract
      }
    }),

    'token-transactions-changed': (state, { payload }) => ({
      ...state,
      token: {
        ...state.token,
        transactions: mergeTransactions(
          state.token.transactions,
          payload.transactions
        )
      }
    }),

    'transactions-next-page': (state, { payload }) => ({
      ...state,
      hasNextPage: payload.hasNextPage,
      page: payload.page
    }),

    'token-state-changed': (state, { payload }) => ({
      ...state,
      token: get(payload, 'wallet.token', state.token)
    }),

    'transactions-scan-started': state => ({
      ...state,
      syncStatus: 'syncing'
    }),

    'transactions-scan-finished': (state, { payload }) => ({
      ...state,
      syncStatus: payload.success ? 'up-to-date' : 'failed'
    }),

    'allow-send-transaction': (state, { payload }) => ({
      ...state,
      allowSendTransaction: payload.allowSendTransaction
    })
  },
  initialState
);

export default reducer;
