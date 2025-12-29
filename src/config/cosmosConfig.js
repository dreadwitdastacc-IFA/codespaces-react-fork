const { CosmosClient } = require('@azure/cosmos');
const { keccak256Hex } = require('../utils/keccakHash');

/**
 * Configuration and utility functions for Azure Cosmos DB interactions.
 * Follows best practices: singleton client reuse, async APIs, retries for 429 errors,
 * high-cardinality partition keys (e.g., userId, walletAddress), and embedding related data.
 * Assumes SQL API and emulator/local setup for development.
 */
// Configuration for Azure Cosmos DB
const endpoint = process.env.COSMOS_ENDPOINT || 'https://localhost:8081'; // Use emulator for local dev
const key = process.env.COSMOS_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=='; // Emulator key
const databaseId = 'YourDatabaseId'; // Replace with your database ID
const containerId = 'YourContainerId'; // Replace with your container ID

// Singleton CosmosClient instance
let client = null;

function getClient() {
  if (!client) {
    client = new CosmosClient({
      endpoint,
      key,
      connectionPolicy: {
        enableEndpointDiscovery: false, // For emulator
      },
    });
  }
  return client;
}

// Utility function to create database if not exists
async function createDatabaseIfNotExists() {
  const client = getClient();
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  return database;
}

// Utility function to create container if not exists
async function createContainerIfNotExists(partitionKeyPath = '/userId') { // High-cardinality key like userId
  const database = await createDatabaseIfNotExists();
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: [partitionKeyPath] },
  });
  return container;
}

const { retryWithBackoff } = require('../utils/retry');

// Example CRUD function with robust retry/backoff
async function createItem(item, partitionKey) {
  const container = await createContainerIfNotExists();
  // Ensure item has an id; generate one using keccak256 for compact uniqueness
  if (!item.id) {
    try {
      item.id = `${partitionKey}-${keccak256Hex(JSON.stringify(item) + Date.now())}`;
    } catch {
      // Fallback to timestamp-based id if hashing fails
      item.id = `${partitionKey}-${Date.now()}`;
    }
  }

  return retryWithBackoff(async () => {
    const { resource } = await container.items.create(item, { partitionKey });
    return resource;
  }, {
    retries: 6,
    baseMs: 150,
    maxMs: 5000,
    shouldRetry: (err) => err && (err.code === 429 || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT'),
  });
}

async function updateItem(itemId, updatedItem, partitionKey) {
  const container = await createContainerIfNotExists();
  return retryWithBackoff(async () => {
    const { resource } = await container.items.upsert(updatedItem, { partitionKey });
    return resource;
  }, {
    retries: 4,
    baseMs: 150,
    maxMs: 3000,
  });
}

async function deleteItem(itemId, partitionKey) {
  const container = await createContainerIfNotExists();
  return retryWithBackoff(async () => {
    const { resource } = await container.item(itemId, partitionKey).delete();
    return resource;
  }, {
    retries: 4,
    baseMs: 150,
    maxMs: 3000,
  });
}

// Export utilities
module.exports = {
  getClient,
  createDatabaseIfNotExists,
  createContainerIfNotExists,
  createItem,
  updateItem,
  deleteItem,
};
