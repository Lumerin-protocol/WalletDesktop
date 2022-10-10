import { combineReducers } from 'redux';
import connectivity from './connectivity';
import session from './session';
import chain from './chain';
import config from './config';
import proxyRouter from './proxy-router';
import contracts from './contracts';
import meta from './meta';

export default combineReducers({
  connectivity,
  session,
  config,
  chain,
  proxyRouter,
  contracts
  // meta
});
