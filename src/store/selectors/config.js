import { createSelector } from 'reselect';

// Returns the "config" state branch
export const getConfig = state => state.config;

export const getCoinSymbol = state =>
  createSelector(getConfig, configData => configData.chain.symbol);

export const getBuyerProxyPort = state => state.config.chain.buyerProxyPort;

export const getSellerProxyPort = state => state.config.chain.sellerProxyPort;

export const getIsAuthBypassed = state => state.config.chain.bypassAuth;

export const getIp = state => state.config.ip;

export const getBuyerPool = state => state.config.buyerDefaultPool;

export const getRecaptchaSiteKey = state => state.config.recaptchaSiteKey;

export const getFaucetUrl = state => state.config.chain.faucetUrl;
