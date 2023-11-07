import BigNumber from 'bignumber.js';
import moment from 'moment';
import get from 'lodash/get';
import {
  fromTokenBaseUnitsToETH,
  fromTokenBaseUnitsToLMR
} from '../../utils/coinValue';

function isSendTransaction(transaction, myAddress) {
  const from = transaction.from;
  return from.toLowerCase() === myAddress.toLowerCase();
}

function isReceiveTransaction(transaction, myAddress) {
  const to = transaction.to;
  return to?.toLowerCase() === myAddress.toLowerCase();
}

function getTxType(rawTx, tokenData, myAddress) {
  if (isSendTransaction(rawTx, tokenData, myAddress)) {
    return 'sent';
  }
  if (isReceiveTransaction(rawTx, tokenData, myAddress)) {
    return 'received';
  }
  return 'unknown';
}

function getValue(rawTx, txType) {
  if (!['received', 'sent'].includes(txType)) {
    return '0';
  }

  const value = rawTx.amount;
  return value;
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

function getGasUsed(rawTx) {
  return get(rawTx, ['receipt', 'gasUsed'], null);
}

function getTransactionHash(rawTx) {
  return get(rawTx, ['transaction', 'hash'], null);
}

function getBlockNumber(rawTx) {
  return get(rawTx, ['transaction', 'blockNumber'], null);
}

function getFormattedTime(timestamp) {
  return timestamp ? moment.unix(timestamp).format('LLLL') : null;
}

export const createTransactionParser = myAddress => rawTx => {
  const txType = getTxType(rawTx, myAddress);
  const timestamp = Number(rawTx.timestamp);
  const symbol = rawTx.token;
  const value = getValue(rawTx, txType);

  return {
    formattedTime: getFormattedTime(timestamp),
    blockNumber: rawTx.blockNumber,
    timestamp,
    gasUsed: rawTx.transactionFee,
    txType,
    symbol,
    value:
      symbol === 'LMR'
        ? fromTokenBaseUnitsToLMR(value)
        : fromTokenBaseUnitsToETH(value),
    from: rawTx.from,
    hash: rawTx.txhash,
    to: rawTx.to
  };
};
