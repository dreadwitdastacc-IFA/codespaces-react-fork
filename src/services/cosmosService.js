import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT || 'http://localhost:8081/';
const key = process.env.COSMOS_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==';
const databaseId = 'ExpenseTrackerDB';
const transactionsContainerId = 'Transactions';
const chatsContainerId = 'Chats';

const client = new CosmosClient({
  endpoint,
  key,
  connectionPolicy: {
    enableEndpointDiscovery: false, // For emulator
    preferredLocations: ['West US 2'],
  },
  consistencyLevel: 'Session',
  // Enable diagnostics for monitoring
  diagnosticLevel: 'info',
});

class CosmosService {
  constructor() {
    this.database = client.database(databaseId);
    this.transactionsContainer = this.database.container(transactionsContainerId);
    this.chatsContainer = this.database.container(chatsContainerId);
  }

  async init() {
    try {
      console.log('Initializing Cosmos DB...');
      // Create database if not exists
      await client.databases.createIfNotExists({ id: databaseId });
      // Create containers if not exists
      await this.database.containers.createIfNotExists({
        id: transactionsContainerId,
        partitionKey: '/type'
      });
      await this.database.containers.createIfNotExists({
        id: chatsContainerId,
        partitionKey: '/userId'
      });
      console.log('Cosmos DB initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize Cosmos DB:', error);
      throw error;
    }
  }

  async getTransactions() {
    try {
      const querySpec = {
        query: 'SELECT * FROM c'
      };
      const { resources } = await this.transactionsContainer.items.query(querySpec).fetchAll();
      console.log(`Retrieved ${resources.length} transactions from Cosmos DB.`);
      return resources;
    } catch (error) {
      console.error('Failed to get transactions:', error);
      throw error;
    }
  }

  async addTransaction(transaction) {
    const { resource } = await this.transactionsContainer.items.create(transaction);
    return resource;
  }

  async updateTransaction(id, transaction) {
    const { resource } = await this.transactionsContainer.item(id, transaction.type).replace(transaction);
    return resource;
  }

  async deleteTransaction(id, partitionKey) {
    await this.transactionsContainer.item(id, partitionKey).delete();
  }

  // Chat methods with retry logic and error handling
  async getChatHistory(userId, limit = 50) {
    try {
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.timestamp DESC',
        parameters: [{ name: '@userId', value: userId }]
      };
      const { resources } = await this.chatsContainer.items.query(querySpec).fetchAll();
      console.log(`Retrieved ${resources.length} chat messages for user ${userId}`);
      return resources.slice(0, limit);
    } catch (error) {
      if (error.code === 429) {
        console.warn('Rate limited, retrying after 1 second...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getChatHistory(userId, limit);
      }
      console.error('Failed to get chat history:', error);
      throw error;
    }
  }

  async addChatMessage(message) {
    const { resource } = await this.chatsContainer.items.create(message);
    return resource;
  }

  async deleteChatHistory(userId) {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: userId }]
    };
    const { resources } = await this.chatsContainer.items.query(querySpec).fetchAll();
    for (const msg of resources) {
      await this.chatsContainer.item(msg.id, msg.userId).delete();
    }
  }
}

const cosmosService = new CosmosService();
export default cosmosService;
