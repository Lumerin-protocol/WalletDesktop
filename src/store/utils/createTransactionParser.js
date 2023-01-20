import BigNumber from 'bignumber.js';
import moment from 'moment';
import get from 'lodash/get';
import { getEthBalance, getLmrBalance } from './coinValue';

function isSendTransaction({ transaction }, tokenData, myAddress) {
  return transaction.from === myAddress;
}

function isReceiveTransaction({ transaction }, tokenData, myAddress) {
  const to = transaction.input?.to || transaction.to;
  return to?.toLowerCase() === myAddress.toLowerCase();
}

function isImportRequestTransaction(rawTx) {
  return get(rawTx.meta, 'lumerin.importRequest', false);
}

function getTxType(rawTx, tokenData, myAddress) {
  if (isImportRequestTransaction(rawTx)) return 'import-requested';
  if (isSendTransaction(rawTx, tokenData, myAddress)) return 'sent';
  if (isReceiveTransaction(rawTx, tokenData, myAddress)) return 'received';
  return 'unknown';
}

function getFrom(rawTx, tokenData, txType) {
  return txType === 'received' && tokenData && tokenData.from
    ? tokenData.from
    : rawTx.transaction.from
    ? rawTx.transaction.from
    : null;
}

function getTo(rawTx, tokenData, txType) {
  return txType === 'sent' &&
    rawTx.transaction.input &&
    rawTx.transaction.input.to
    ? rawTx.transaction.input.to
    : rawTx.transaction.to
    ? rawTx.transaction.to
    : null;
}

function getValue(rawTx, tokenData, txType) {
  if (!['received', 'sent'].includes(txType)) {
    return '0';
  }

  const value = rawTx.transaction.input?.amount || rawTx.transaction.value;
  return value;
}

function getSymbol(rawTx, tokenData, txType) {
  const isLmr = typeof rawTx.transaction.input === 'object';
  return isLmr ? 'LMR' : 'ETH';
}

function getConvertedFrom(rawTx, txType) {
  return txType === 'converted'
    ? new BigNumber(rawTx.transaction.value).isZero()
      ? 'LMR'
      : 'coin'
    : null;
}

function getIsApproval(tokenData) {
  return (
    !!tokenData &&
    tokenData.event === 'Approval' &&
    !new BigNumber(tokenData.value).isZero()
  );
}

function getIsCancelApproval(tokenData) {
  return (
    !!tokenData &&
    tokenData.event === 'Approval' &&
    new BigNumber(tokenData.value).isZero()
  );
}

function getApprovedValue(tokenData) {
  return tokenData && tokenData.event === 'Approval' ? tokenData.value : null;
}

function getIsProcessing(tokenData) {
  return get(tokenData, 'processing', false);
}

function getIsPending(rawTx) {
  return !get(rawTx, 'receipt', null);
}

function getContractCallFailed(rawTx) {
  return get(rawTx, ['meta', 'contractCallFailed'], false);
}

function getGasUsed(rawTx) {
  return get(rawTx, ['receipt', 'gasUsed'], null);
}

function getTransactionHash(rawTx) {
  return get(rawTx, ['transaction', 'hash'], null);
}

function getBlockNumber(rawTx) {
  return get(rawTx, ['transaction', 'blockNumber'], null);
}

// TODO: in the future other transaction types will include a timestamp
function getTimestamp(rawTx) {
  const timestamp = get(
    rawTx,
    ['meta', 'lumerin', 'export', 'blockTimestamp'],
    null
  );
  return timestamp ? Number(timestamp) : null;
}

function getFormattedTime(timestamp) {
  return timestamp ? moment.unix(timestamp).format('LLLL') : null;
}

export const createTransactionParser = myAddress => rawTx => {
  const tokenData = Object.values(rawTx.meta.token || {})[0] || null;
  const txType = getTxType(rawTx, tokenData, myAddress);
  const timestamp = getTimestamp(rawTx, txType);
  const symbol = getSymbol(rawTx, tokenData, txType);
  const value = getValue(rawTx, tokenData, txType);

  return {
    contractCallFailed: getContractCallFailed(rawTx),
    isCancelApproval: getIsCancelApproval(tokenData),
    approvedValue: getApprovedValue(tokenData),
    formattedTime: getFormattedTime(timestamp),
    isProcessing: getIsProcessing(tokenData),
    blockNumber: getBlockNumber(rawTx),
    isApproval: getIsApproval(tokenData),
    isPending: getIsPending(rawTx),
    timestamp,
    gasUsed: getGasUsed(rawTx),
    txType,
    symbol,
    value: symbol === 'LMR' ? getLmrBalance(value) : getEthBalance(value),
    from: getFrom(rawTx, tokenData, txType),
    hash: getTransactionHash(rawTx),
    meta: rawTx.meta,
    to: getTo(rawTx, tokenData, txType)
  };
};
