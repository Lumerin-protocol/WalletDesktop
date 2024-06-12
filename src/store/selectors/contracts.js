import { createSelector } from 'reselect';
import { v4 as uuidv4 } from 'uuid';
import * as nodeCrypto from 'crypto';
import sortBy from 'lodash/sortBy';

function createRandomContract() {
  const contract = {
    id: generateContractAddress(),
    price: Math.floor(Math.random() * 100000000).toString(),
    speed: Math.floor(
      Math.random() * (1500000000000000 - 50000000000000 + 1) + 50000000000000
    ),
    length: Math.floor(Math.random() * (28800 - 3600 + 1) + 3600), // random rounded number between 1 and 8 hours
    buyer: '0x0000000000000000000000000000000000000000',
    seller: generateContractAddress(),
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
  if (isValidDummyContract(contract)) {
    return contract;
  } else {
    console.log('Invalid dummy contract generated');
  }
}

function generateContractAddress() {
  // Generate a UUID
  const uniqueId = uuidv4();

  // Hash the UUID using SHA-256 to get a predictable length
  const hash = nodeCrypto.createHash('sha256');
  hash.update(uniqueId);
  const hashedUniqueId = hash.digest('hex'); // This will create a 64 characters hexadecimal string

  // Get the first 40 characters to conform to the Ethereum address style
  const address = '0x' + hashedUniqueId.substring(0, 40);

  return address; // this is synchronous and returns immediately
}

function generateDummyContracts() {
  let newContracts = {};

  for (let i = 0; i < 5; i++) {
    const newContract = createRandomContract(); // synchronous call
    if (newContract) {
      newContracts[newContract.id] = newContract; // Check to prevent any issue if a contract was not created properly
    }
  }
  return newContracts;
}

function isValidDummyContract(contract) {
  // Regular expression to validate if a string is a hexadecimal number
  const hexRegExp = /^0x[a-fA-F0-9]{40}$/;

  return (
    hexRegExp.test(contract.id) &&
    contract.price > 0 &&
    contract.speed >= 50000000000000 && // strictly for dummy data
    contract.speed <= 1500000000000000 && // strictly for dummy data
    hexRegExp.test(contract.seller) &&
    hexRegExp.test(contract.buyer)
  );
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
