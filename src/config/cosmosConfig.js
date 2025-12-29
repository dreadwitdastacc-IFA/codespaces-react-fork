import { CosmosClient } from '@azure/cosmos';

// Emulator connection details
const endpoint = process.env.COSMOS_ENDPOINT || 'https://localhost:8081/';
const key = process.env.COSMOS_KEY || 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==';

// Create a singleton CosmosClient instance (reuse to avoid overhead)
export const cosmosClient = new CosmosClient({
  endpoint,
  key,
  connectionPolicy: {
    enableEndpointDiscovery: false,  // For emulator
    preferredLocations: ['West US 2'],  // Example; adjust as needed
  },
  consistencyLevel: 'Session',  // Suitable for most apps; adjust based on needs
});

// Example database and container setup (call this in your app init)
export async function initializeCosmosDB() {
  const { database } = await cosmosClient.databases.createIfNotExists({ id: 'MyDatabase' });
  const { container } = await database.containers.createIfNotExists({
    id: 'MyContainer',
    partitionKey: { paths: ['/userId'] },  // High-cardinality key for even distribution
  });
  return { database, container };
}

// Example query function (minimizes cross-partition queries by using partition key)
export async function queryItems(container, userId) {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.userId = @userId',
    parameters: [{ name: '@userId', value: userId }],
  };
  const { resources } = await container.items.query(querySpec, { partitionKey: userId }).fetchAll();
  return resources;
}
