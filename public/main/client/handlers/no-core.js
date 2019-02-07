'use strict'

const restart = require('../electron-restart')
const dbManager = require('../database')
const logger = require('electron-log')
const storage = require('../storage')
const auth = require('../auth')

const validatePassword = data => auth.isValidPassword(data)

function clearCache () {
  logger.verbose('Clearing database cache')
  return dbManager
    .getDb()
    .dropDatabase()
    .then(restart)
}

const persistState = data => storage.persistState(data).then(() => true)

module.exports = {
  validatePassword,
  persistState,
  clearCache
}
