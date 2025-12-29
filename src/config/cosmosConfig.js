/**
 * Configuration and utility functions for Azure Cosmos DB interactions.
 * Follows best practices: singleton client reuse, async APIs, retries for 429 errors,
 * high-cardinality partition keys (e.g., userId, walletAddress), and embedding related data.
 * Assumes SQL API and emulator/local setup for development.
 */
import { CosmosClient } from '@azure/cosmos';

// Singleton CosmosClient instance for reuse (best practice)
const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT || 'https://localhost:8081/', // Emulator default
  key: process.env.COSMOS_DB_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==', // Emulator key
  // Enable retries and preferred regions if needed for production
});

// Database and container names (adjust as per your setup)
const DATABASE_ID = process.env.COSMOS_DB_DATABASE_ID || 'ChatDB';
const CONTAINER_ID = 'ChatContainer';

/**
 * Initializes and returns the Cosmos DB container.
 * @returns {Object} { container, database }
 */
export async function initializeCosmosDB() {
  try {
    const database = client.database(DATABASE_ID);
    const container = database.container(CONTAINER_ID);
    // Ensure container exists (for emulator/setup; in production, handle via ARM templates)
    await database.containers.createIfNotExists({
      id: CONTAINER_ID,
      partitionKey: { paths: ['/partitionKey'] }, // Generic partition key path
    });
    return { container, database };
  } catch (error) {
    console.error('Error initializing Cosmos DB:', error);
    throw error;
  }
}

/**
 * Stores a chat message item in Cosmos DB.
 * Embeds message data for AI/chat use case; partitions by userId for isolation.
 * @param {Object} container - Cosmos DB container.
 * @param {string} userId - User ID (high-cardinality partition key).
 * @param {Object} message - Message object (e.g., { text, timestamp }).
 * @returns {Object} Created item.
 */
export async function storeChatMessage(container, userId, message) {
  const item = {
    id: `${userId}-${Date.now()}`, // Unique ID
    partitionKey: userId,
    userId,
    message,
    type: 'chatMessage', // For query filtering
  };
  const { resource } = await container.items.create(item);
  return resource;
}

/**
 * Fetches chat history for a user.
 * Queries within a single partition for efficiency.
 * @param {Object} container - Cosmos DB container.
 * @param {string} userId - User ID.
 * @param {number} limit - Max items to return.
 * @returns {Array} Array of chat messages.
 */
export async function getChatHistory(container, userId, limit = 50) {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.partitionKey = @userId AND c.type = "chatMessage" ORDER BY c._ts DESC',
    parameters: [{ name: '@userId', value: userId }],
  };
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources.slice(0, limit);
}

/**
 * Retrieves payloads for a connected wallet.
 * Assumes payloads are stored as items partitioned by walletAddress (high-cardinality key).
 * Minimizes cross-partition queries by targeting one partition.
 * @param {Object} container - Cosmos DB container.
 * @param {string} walletAddress - Wallet address.
 * @param {number} limit - Max items to return.
 * @returns {Array} Array of payload items.
 */
export async function getPayloads(container, walletAddress, limit = 50) {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.partitionKey = @walletAddress AND c.type = "payload" ORDER BY c._ts DESC',
    parameters: [{ name: '@walletAddress', value: walletAddress }],
  };
  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources.slice(0, limit);
}

/**
 * Creates an item with retry logic for 429 errors.
 * @param {Object} container - Cosmos DB container.
 * @param {Object} item - Item to create.
 * @param {string} partitionKey - Partition key value.
 * @returns {Object} Created item.
 */
export async function createItemWithRetry(container, item, partitionKey) {
  item.partitionKey = partitionKey; // Ensure partition key is set
  try {
    const { resource } = await container.items.create(item);
    return resource;
  } catch (error) {
    if (error.code === 429) {
      // Retry after delay (implement exponential backoff if needed)
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createItemWithRetry(container, item, partitionKey);
    }
    throw error;
  }
}

/**
 * Updates an item with retry logic.
 * @param {Object} container - Cosmos DB container.
 * @param {string} itemId - Item ID.
 * @param {Object} updatedItem - Updated item data.
 * @param {string} partitionKey - Partition key value.
 * @returns {Object} Updated item.
 */
export async function updateItemWithRetry(container, itemId, updatedItem, partitionKey) {
  try {
    const { resource } = await container.items.upsert(updatedItem);
    return resource;
  } catch (error) {
    if (error.code === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updateItemWithRetry(container, itemId, updatedItem, partitionKey);
    }
    throw error;
  }
}

/**
 * Deletes an item with retry logic.
 * @param {Object} container - Cosmos DB container.
 * @param {string} itemId - Item ID.
 * @param {string} partitionKey - Partition key value.
 * @returns {Object} Delete response.
 */
export async function deleteItemWithRetry(container, itemId, partitionKey) {
  try {
    const { resource } = await container.item(itemId, partitionKey).delete();
    return resource;
  } catch (error) {
    if (error.code === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return deleteItemWithRetry(container, itemId, partitionKey);
    }
    throw error;
  }
}
