import { createSelector } from 'reselect';

// Returns the "config" state branch
export const getConfig = state => state.config;

export const getCoinSymbol = state =>
  createSelector(getConfig, configData => configData.chain.symbol);
