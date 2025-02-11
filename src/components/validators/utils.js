export const docUrl =
  'https://gitbook.lumerin.io/lumerin-hashpower-marketplace/validator/become-a-validator-checklist';

export function isHostPortValid(hostPort) {
  const [host, port] = hostPort.split(':');
  if (!host || !port) {
    return false;
  }
  const portNumber = parseInt(port);
  if (portNumber < 1 || portNumber > 65535) {
    return false;
  }

  // Check if host is a valid IPv4 address
  if (isIPAddress(host)) {
    return true;
  }

  // Check if host is a valid domain name
  const domainRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
  if (!domainRegex.test(host)) {
    return false;
  }

  return true;
}

/**
 * Checks if the given string is a valid IPv4 address
 * @param {string} ip - The string to check
 * @returns {boolean} True if the string is a valid IPv4 address, false otherwise
 */
function isIPAddress(ip) {
  const elems = ip.split('.');
  if (elems.length !== 4) {
    return false;
  }
  for (const elem of elems) {
    const num = parseInt(elem);
    if (isNaN(num)) {
      return false;
    }
    if (num < 0 || num > 255) {
      return false;
    }
  }
  return true;
}
