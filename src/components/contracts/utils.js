import moment from 'moment';
import { lmrDecimals } from '../../utils/coinValue';
import { CONTRACT_STATE } from '../../enums';

const getReadableDate = (days, hours, minutes, seconds) => {
  const readableDays = days
    ? days === 1
      ? `${days} day`
      : `${days} days`
    : '';
  const readableHours = hours
    ? hours === 1
      ? `${hours} hour`
      : `${hours} hours`
    : '';
  const readableMinutes = minutes
    ? minutes === 1
      ? `${minutes} minute`
      : `${minutes} minutes`
    : '';
  const readableSeconds =
    !days && !hours && !minutes && seconds
      ? seconds === 1
        ? `1 second`
        : `${seconds} seconds`
      : '';
  const readableDate = `${readableDays} ${readableHours} ${readableMinutes} ${readableSeconds}`.trim();
  return readableDate;
};

export const formatSpeed = speed => {
  return `${Number(speed) / 10 ** 12} TH/s`;
};

export const formatTimestamp = (timestamp, timer, state) => {
  if (+timestamp === 0) {
    return '';
  }
  if (state !== CONTRACT_STATE.Running) {
    return '';
  }
  const startDate = moment.unix(timestamp).format('L');
  const { days, hours, minutes, seconds } = timer;
  if (days || hours || minutes || seconds) {
    const durationLeft = getReadableDate(days, hours, minutes, seconds);
    return `${startDate} (${durationLeft} left)`;
  } else {
    return `${startDate} (completed)`;
  }
};

export const formatPrice = price => {
  return `${Number(price) / lmrDecimals} LMR`;
};

export const formatDuration = duration => {
  const numLength = parseFloat(duration / 3600);
  const days = Math.floor(numLength / 24);
  const remainder = numLength % 24;
  const hours = days >= 1 ? Math.floor(remainder) : Math.floor(numLength);
  const minutes =
    days >= 1
      ? Math.floor(60 * (remainder - hours))
      : Math.floor((numLength - Math.floor(numLength)) * 60);
  const seconds = Math.floor(duration % 60);
  const readableDate = getReadableDate(days, hours, minutes, seconds);
  return readableDate;
};

export const isContractClosed = contract => {
  return contract.seller === contract.buyer;
};

export const getContractState = contract => {
  return Object.entries(CONTRACT_STATE).find(s => contract.state === s[1])[0];
};

export const getContractEndTimestamp = contract => {
  if (+contract.timestamp === 0) {
    return 0;
  }
  return (+contract.timestamp + +contract.length) * 1000; // in ms
};

export const truncateAddress = (address, desiredLength) => {
  let index;
  switch (desiredLength) {
    case 'SHORT':
      return `${address.substring(0, 5)}...`;
    case 'MEDIUM':
      index = 5;
      break;
    case 'LONG':
      index = 10;
      break;
    default:
      index = 10;
  }
  return `${address.substring(0, index)}...${address.substring(
    address.length - index,
    address.length
  )}`;
};
