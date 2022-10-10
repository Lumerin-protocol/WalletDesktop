import { handleActions } from 'redux-actions';
import get from 'lodash/get';

// TODO: remove dummy data
const initialState = {
  lastUpdated: null,
  syncStatus: null,
  isConnected: false,
  connections: [
    // {
    //   ipAddress: '127.0.0.1',
    //   status: 'Running',
    //   socketAddress: '192.168.5.50',
    //   total: 30293,
    //   accepted: 29901,
    //   rejected: 290
    // },
    // {
    //   ipAddress: '127.0.0.1',
    //   status: 'Available',
    //   socketAddress: '192.168.5.51',
    //   total: 30293,
    //   accepted: 29901,
    //   rejected: 290
    // },
    // {
    //   ipAddress: '127.0.0.1',
    //   status: 'Available',
    //   socketAddress: '192.168.5.51',
    //   total: 30293,
    //   accepted: 29901,
    //   rejected: 290
    // },
    // {
    //   ipAddress: '127.0.0.1',
    //   status: 'Available',
    //   socketAddress: '192.168.5.51',
    //   total: 30293,
    //   accepted: 29901,
    //   rejected: 290
    // },
    // {
    //   ipAddress: '127.0.0.1',
    //   status: 'Running',
    //   socketAddress: '192.168.5.50',
    //   total: 30293,
    //   accepted: 29901,
    //   rejected: 290
    // }
  ]
};

const reducer = handleActions(
  {
    'initial-state-received': (state, { payload }) => ({
      ...state,
      ...get(payload, 'proxyRouter', {})
    }),

    'proxy-router-status-changed': (state, { payload }) => ({
      ...state,
      lastUpdated: parseInt(Date.now() / 1000, 10),
      isConnected: payload.isConnected,
      syncStatus: payload.syncStatus
    }),

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
