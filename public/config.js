'use strict'

// TODO: check better way to handle env vars for packaged version

const config = {
  sentryDsn:
    process.env.SENTRY_DSN || 'https://d9905c2eec994071935593d4085d3547@sentry.io/290706'
}

module.exports = config
