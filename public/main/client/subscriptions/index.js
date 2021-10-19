'use strict';

// const { subscribeMultiCore, unsubscribeMultiCore } = require('./multi-core');
const { subscribeSingleCore, unsubscribeSingleCore } = require('./single-core');
const { subscribeWithoutCore, unsubscribeWithoutCore } = require('./no-core');

function subscribe (core) {
  subscribeSingleCore(core);
  // subscribeMultiCore(core);
  subscribeWithoutCore();
}

function unsubscribe (core) {
  unsubscribeSingleCore(core);
  // unsubscribeMultiCore();
  unsubscribeWithoutCore();
}

module.exports = { subscribe, unsubscribe };
