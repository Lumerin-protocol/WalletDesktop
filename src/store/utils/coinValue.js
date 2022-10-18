const lmrEightDecimals = 100000000;
const ethWeiDecimals = 1000000000000000000;

export const getLmrBalance = value => value / lmrEightDecimals;

export const getEthBalance = value => value / ethWeiDecimals;