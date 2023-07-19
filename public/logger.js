

const chalk = require('chalk');
const logger = require('electron-log');
const stringify = require('json-stringify-safe');
const config = require('./config');

logger.transports.file.appName = 'lumerin-wallet-desktop';

function getColorLevel (level = '') {
  const colors = {
    error: 'red',
    verbose: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    silly: 'blue'
  };
  return colors[level.toString()] || 'green';
}

logger.transports.console = function ({ date, level, data }) {
  if(!config.debug && !['error', 'warn', 'info'].includes(level))
    return;
  
  const color = getColorLevel(level);

  const text = data.shift();

  let meta = '';
  if (data.length) {
    meta += ' => ';
    meta += data.map(d => typeof d === 'object' ? stringify(d) : d).join(', ');
  }

  // eslint-disable-next-line no-console
  console.log(
    `${date.toISOString()} - ${chalk[color](level)}:\t${text}\t${meta}`
  );
}

if (config.debug) {
  logger.transports.console.level = 'verbose';
  logger.transports.file.level = 'verbose';
}


module.exports = logger;
