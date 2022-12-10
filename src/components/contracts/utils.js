import moment from 'moment';
import { lmrEightDecimals } from '../../store/utils/coinValue';
import { CONTRACT_STATE } from '../../enums';

export const formatSpeed = speed => {
  return Number(speed) / 10 ** 12;
};

export const formatTimestamp = timestamp => {
  if (+timestamp === 0) {
    return '';
  }
  return moment.unix(timestamp).format('L');
};

export const formatPrice = price => {
  return `${Number(price) / lmrEightDecimals} LMR`;
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
    !minutes && seconds
      ? seconds === 1
        ? `1 second`
        : `${seconds} seconds`
      : '';
  const readableDate = `${readableDays} ${readableHours} ${readableMinutes} ${readableSeconds}`.trim();
  return readableDate;
};

export const isContractClosed = contract => {
  return contract.seller === contract.buyer;
};

export const getContractState = contract => {
  if (isContractClosed(contract)) {
    return 'Closed';
  }

  return Object.entries(CONTRACT_STATE).find(s => contract.state === s[1])[0];
};
