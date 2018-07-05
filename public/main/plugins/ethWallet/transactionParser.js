'use strict'

const { isAddressInWallet } = require('./settings')
const { parseTraces } = require('./tracesParser')

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

// eslint-disable-next-line complexity
function transactionParser ({ transaction, receipt, walletId }) {
  const from = transaction.from.toLowerCase()
  const to = (transaction.to || NULL_ADDRESS).toLowerCase()

  const { gas, hash, input } = transaction

  const outgoing = isAddressInWallet({ walletId, address: from })
  const incoming = isAddressInWallet({ walletId, address: to })

  const meta = {
    ours: [outgoing || incoming]
  }

  meta.contractCallFailed = receipt &&
    (receipt.status === false || // byzantium fork
    (input !== '0x' && gas === receipt.gasUsed && !receipt.logs.length))

  if (meta.ours) {
    meta.walletIds = [walletId]
    meta.addresses = outgoing ? [from] : incoming ? [to] : []
  }

  if (outgoing) {
    return parseTraces({ hash, from })
      .then(parsed => Object.assign(meta, parsed))
      .catch(err => Object.assign(meta, { parseError: err.message }))
  }

  return meta
}

module.exports = transactionParser
