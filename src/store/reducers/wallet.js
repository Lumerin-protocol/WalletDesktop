import { handleActions } from 'redux-actions';
import get from 'lodash/get';

export const initialState = {
  syncStatus: 'up-to-date',
  isActive: false,
  address: '',
  ethBalance: 0,
  transactions: [],
  token: {
    contract: '',
    lmrBalance: 0,
    transactions: [],
    symbol: 'LMR'
  }
};

/**
 * Should filter transactions without receipt if we received ones
 */
const mergeTransactions = (stateTxs, payloadTxs) => {
  return [...stateTxs, ...payloadTxs].filter(tx => {
    if (tx.receipt) {
      return true;
    }
    const isTransactionWithReceiptReceived = payloadTxs.find(
      t => t.receipt && t.transaction.hash === tx.transaction.hash
    );
    return !isTransactionWithReceiptReceived;
  });
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

    'wallet-transactions-changed': (state, { payload }) => ({
      ...state,
      transactions: mergeTransactions(state.transactions, payload.transactions)
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
      transactions: payload.transactions,
      syncStatus: payload.success ? 'up-to-date' : 'failed'
    })
  },
  initialState
);

export default reducer;
