import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT || 'https://your-cosmos-account.documents.azure.com:443/';
const key = process.env.COSMOS_KEY || 'your-primary-key';
const databaseId = 'ExpenseTrackerDB';
const transactionsContainerId = 'Transactions';
const chatsContainerId = 'Chats';

const client = new CosmosClient({ endpoint, key });

class CosmosService {
  constructor() {
    this.database = client.database(databaseId);
    this.transactionsContainer = this.database.container(transactionsContainerId);
    this.chatsContainer = this.database.container(chatsContainerId);
  }

  async init() {
    // Create database if not exists
    await client.databases.createIfNotExists({ id: databaseId });
    // Create containers if not exists
    await this.database.containers.createIfNotExists({
      id: transactionsContainerId,
      partitionKey: '/type'
    });
    await this.database.containers.createIfNotExists({
      id: chatsContainerId,
      partitionKey: '/userId' // Assuming userId for chat partitioning
    });
  }

  async getTransactions() {
    const querySpec = {
      query: 'SELECT * FROM c'
    };
    const { resources } = await this.transactionsContainer.items.query(querySpec).fetchAll();
    return resources;
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

  // Chat methods
  async getChatHistory(userId) {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.timestamp',
      parameters: [{ name: '@userId', value: userId }]
    };
    const { resources } = await this.chatsContainer.items.query(querySpec).fetchAll();
    return resources;
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
