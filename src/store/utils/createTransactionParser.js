import BigNumber from 'bignumber.js';
import moment from 'moment';
import get from 'lodash/get';
import { getLmrBalance } from './coinValue';

function isSendTransaction({ transaction }, tokenData, myAddress) {
  return transaction.from === myAddress;
}

function isReceiveTransaction({ transaction }, tokenData, myAddress) {
  return (
    (transaction.input && transaction.input.to === myAddress) ||
    transaction.to === myAddress
  );
}

function isImportRequestTransaction(rawTx) {
  return get(rawTx.meta, 'lumerin.importRequest', false);
}

function getTxType(rawTx, tokenData, myAddress) {
  if (isImportRequestTransaction(rawTx)) return 'import-requested';
  if (isSendTransaction(rawTx, tokenData, myAddress)) return 'sent';
  if (isReceiveTransaction(rawTx, tokenData, myAddress.toLowerCase()))
    return 'received';
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
  return ['received', 'sent'].includes(txType) &&
    rawTx.transaction.input &&
    rawTx.transaction.input.amount
    ? rawTx.transaction.input.amount
    : '0';
}

function getSymbol(tokenData, txType) {
  return ['received', 'sent'].includes(txType) ? 'LMR' : 'coin';
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
    symbol: getSymbol(tokenData, txType),
    value: getLmrBalance(getValue(rawTx, tokenData, txType)),
    from: getFrom(rawTx, tokenData, txType),
    hash: getTransactionHash(rawTx),
    meta: rawTx.meta,
    to: getTo(rawTx, tokenData, txType)
  };
};
