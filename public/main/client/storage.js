'use strict'

const promiseThrottle = require('./promise-throttle')
const { defaultTo, get } = require('lodash/fp')
const { getDb } = require('./database')

const keysToPersist = ['chains']

const mapToObject = array =>
  array.reduce(function (acum, current) {
    acum[current.type] = current.data
    return acum
  }, {})

const persistState = promiseThrottle(function (state) {
  return Promise.all(
    keysToPersist.map(function persist (key) {
      const query = { type: key }
      const update = Object.assign({ data: state[key] }, query)

      return getDb()
        .collection('state')
        .updateAsync(query, update, { upsert: true })
    })
  )
})

function getState () {
  return getDb()
    .collection('state')
    .findAsync({ type: { $in: keysToPersist } })
    .then(mapToObject)
}

function setSyncBlock (number, chain) {
  const query = { type: 'sync' }
  const update = Object.assign({ data: { number } }, query)

  return getDb()
    .collection(`sync-${chain}`)
    .updateAsync(query, update, { upsert: true })
}

function getSyncBlock (chain) {
  return getDb()
    .collection(`sync-${chain}`)
    .findOneAsync({ type: 'sync' })
    .then(defaultTo({ data: { number: 0 } }))
    .then(get('data.number'))
}

module.exports = {
  setSyncBlock,
  getSyncBlock,
  persistState,
  getState
}
