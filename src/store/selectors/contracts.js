import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';

function getRandomHex(size = 40) {
  let result = [];
  let characters = 'ABCDEF0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < size; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return '0x' + result.join('');
}

function createRandomContract() {
  const contract = {
    id: getRandomHex(),
    price: Math.floor(Math.random() * 100000000).toString(),
    speed: Math.floor(
      Math.random() * (1500000000000000 - 50000000000000 + 1) + 50000000000000
    ),
    length: Math.floor(Math.random() * (28800 - 3600 + 1) + 3600), // random rounded number between 1 and 8 hours
    buyer: '0x0000000000000000000000000000000000000000',
    seller: getRandomHex(),
    timestamp:
      Date.now() -
      Math.floor(Math.random() * (3 * 7 * 24 * 60 * 60 * 1000)).toString(), // random timestamp within the last 3 weeks
    state: '0',
    encryptedPoolData: '',
    limit: '0',
    isDead: false,
    balance: (Math.random() * 10000000).toString(),
    stats: {
      successCount: Math.floor(Math.random() * 10).toString(),
      failCount: Math.floor(Math.random() * 10).toString()
    },
    hasFutureTerms: false,
    futureTerms: null,
    history: [],
    version: '0'
  };

  return contract;
}

function generateDummyContracts() {
  let newContracts = {};
  for (let i = 0; i < 500; i++) {
    const newContract = createRandomContract();
    newContracts[newContract.id] = newContract;
  }
  return newContracts;
}

// Cache the contracts to prevent regeneration on refresh
let cachedDummyContracts = null;

function getDummyContracts() {
  if (!cachedDummyContracts) {
    // If contracts haven't been created yet, generate them
    cachedDummyContracts = generateDummyContracts();
  }
  return cachedDummyContracts;
}

// Returns the array of transactions of the current chain/wallet/address.
// The items are mapped to contain properties useful for rendering.
export const getContracts = state => {
  const dummyContracts = getDummyContracts();
  const realContracts = state.contracts;

  const combinedActiveContracts = {
    ...realContracts.actives,
    ...dummyContracts
  };

  const combinedContracts = {
    ...realContracts,
    actives: combinedActiveContracts
  };
  return combinedContracts;
};

export const getActiveContracts = createSelector(getContracts, contractsData =>
  sortBy(Object.values(contractsData.actives), 'timestamp')
);

export const getDraftContracts = createSelector(
  getContracts,
  contractsData => contractsData.drafts
);

export const getMergeAllContracts = createSelector(
  getActiveContracts,
  getDraftContracts,
  (activeContracts, draftContracts) =>
    [...activeContracts, ...draftContracts].reverse()
);

// Returns if the current wallet/address has transactions on the active chain
export const hasContracts = createSelector(
  getContracts,
  contractsData => Object.keys(contractsData.actives).length !== 0
);

export const getActiveContractsCount = createSelector(
  getActiveContracts,
  contractsData => contractsData.length
);

export const getDraftContractsCount = createSelector(
  getDraftContracts,
  contractsData => contractsData.length
);

// Returns wallet transactions sync status on the active chain
export const getContractsSyncStatus = createSelector(
  getContracts,
  contractsData => contractsData.syncStatus
);

export const getContractsLastUpdated = createSelector(
  getContracts,
  contractsData => contractsData.lastUpdated
);
