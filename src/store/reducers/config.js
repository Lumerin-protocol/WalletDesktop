import { handleActions } from 'redux-actions';

const initialState = {
  chain: {}
};

const reducer = handleActions(
  {
    'initial-state-received': (_, { payload }) => payload.config
  },
  initialState
);

export default reducer;
