//@ts-check
import { handleActions } from 'redux-actions';
import get from 'lodash/get';

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
    symbol: 'LMR',
    symbolEth: 'ETH'
  },
  fee: ''
};

/**
 * Should filter transactions without receipt if we received ones
 */
const mergeTransactions = (stateTxs, payloadTxs) => {
  const newStateTxs = { ...stateTxs };
  const txs = Object.values(payloadTxs).filter(x => typeof x == 'object');

  for (const tx of txs) {
    const flattenObjects = tx.transfers.map(x => ({
      ...tx,
      ...x,
      transfers: undefined
    }));
    for (const obj of flattenObjects) {
      if (obj.amount == 0) {
        continue;
      }
      const key = `${obj.txhash}_${obj.token || 'ETH'}`;
      newStateTxs[key] = obj;
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

    'token-transactions-changed': (state, { payload }) => {
      return {
        ...state,
        token: {
          ...state.token,
          transactions: mergeTransactions(state.token.transactions, payload)
        }
      };
    },

    'transactions-next-page': (state, { payload }) => {
      console.log(payload);
      return {
        ...state,
        hasNextPage: payload.hasNextPage,
        page: payload.page
      };
    },

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
    }),
    'set-marketplace-fee': (state, { payload }) => ({
      ...state,
      marketplaceFee: payload
    })
  },
  initialState
);

export default reducer;
