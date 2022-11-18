import { handleActions } from 'redux-actions';
import get from 'lodash/get';

// TODO: remove dummy data
const initialState = {
  lastUpdated: null,
  syncStatus: 'syncing',
  isConnected: false,
  connections: []
};

const reducer = handleActions(
  {
    'initial-state-received': (state, { payload }) => ({
      ...state,
      ...get(payload, 'proxyRouter', {})
    }),

    'proxy-router-status-changed': (state, { payload }) => (
      console.log('a', payload),
      {
        ...state,
        lastUpdated: parseInt(Date.now() / 1000, 10),
        isConnected: payload.isConnected,
        syncStatus: payload.syncStatus
      }
    ),

    'proxy-router-connections-changed': (state, { payload }) => ({
      ...state,
      connections: payload.connections,
      lastUpdated: parseInt(Date.now() / 1000, 10),
      syncStatus: payload.syncStatus
    })
  },
  initialState
);

export default reducer;
