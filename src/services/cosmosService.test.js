import { describe, it, expect, vi, beforeEach } from 'vitest';
import cosmosService from './cosmosService';

vi.mock('@azure/cosmos', () => ({
  CosmosClient: vi.fn().mockImplementation(() => ({
    databases: {
      createIfNotExists: vi.fn().mockResolvedValue({}),
    },
    database: vi.fn().mockReturnValue({
      containers: {
        createIfNotExists: vi.fn().mockResolvedValue({}),
      },
      container: vi.fn().mockReturnValue({
        items: {
          query: vi.fn().mockReturnValue({
            fetchAll: vi.fn().mockResolvedValue({ resources: [] }),
          }),
          create: vi.fn().mockResolvedValue({ resource: {} }),
        },
        item: vi.fn().mockReturnValue({
          replace: vi.fn().mockResolvedValue({ resource: {} }),
          delete: vi.fn().mockResolvedValue({}),
        }),
      }),
    }),
  })),
}));

describe('CosmosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('init creates containers', async () => {
    await cosmosService.init();
    expect(cosmosService.database.containers.createIfNotExists).toHaveBeenCalledTimes(2);
  });

  it('getTransactions queries items for user', async () => {
    const mockResources = [{ id: '1', userId: 'user1' }];
    cosmosService.transactionsContainer.items.query().fetchAll.mockResolvedValue({ resources: mockResources });
    const res = await cosmosService.getTransactions('user1');
    expect(res).toEqual(mockResources);
  });

  it('addTransaction creates item', async () => {
    const tx = { id: '1', userId: 'user1' };
    cosmosService.transactionsContainer.items.create.mockResolvedValue({ resource: tx });
    const res = await cosmosService.addTransaction(tx);
    expect(res).toBe(tx);
  });

  it('updateTransaction replaces item', async () => {
    const tx = { id: '1', userId: 'user1' };
    cosmosService.transactionsContainer.item().replace.mockResolvedValue({ resource: tx });
    const res = await cosmosService.updateTransaction('1', tx);
    expect(res).toBe(tx);
  });

  it('deleteTransaction deletes item', async () => {
    await cosmosService.deleteTransaction('1', 'user1');
    expect(cosmosService.transactionsContainer.item().delete).toHaveBeenCalled();
  });

  it('getChatHistory queries ordered items', async () => {
    const mockResources = [{ id: '1', userId: 'user1', timestamp: '2023-01-01' }];
    cosmosService.chatsContainer.items.query().fetchAll.mockResolvedValue({ resources: mockResources });
    const res = await cosmosService.getChatHistory('user1');
    expect(res).toEqual(mockResources);
  });

  it('addChatMessage creates item', async () => {
    const msg = { id: '1', userId: 'user1' };
    cosmosService.chatsContainer.items.create.mockResolvedValue({ resource: msg });
    const res = await cosmosService.addChatMessage(msg);
    expect(res).toBe(msg);
  });

  it('deleteChatHistory deletes all messages', async () => {
    const mockResources = [{ id: '1', userId: 'user1' }, { id: '2', userId: 'user1' }];
    cosmosService.chatsContainer.items.query().fetchAll.mockResolvedValue({ resources: mockResources });
    await cosmosService.deleteChatHistory('user1');
    expect(cosmosService.chatsContainer.item().delete).toHaveBeenCalledTimes(2);
  });
});
import { describe, it, expect, vi } from 'vitest';
import cosmosService from './cosmosService';

vi.mock('@azure/cosmos', () => ({
  CosmosClient: vi.fn().mockImplementation(() => ({
    databases: {
      createIfNotExists: vi.fn().mockResolvedValue({}),
    },
    database: vi.fn().mockReturnValue({
      containers: {
        createIfNotExists: vi.fn().mockResolvedValue({}),
      },
      container: vi.fn().mockReturnValue({
        items: {
          query: vi.fn().mockReturnValue({
            fetchAll: vi.fn().mockResolvedValue({ resources: [] }),
          }),
          create: vi.fn().mockResolvedValue({ resource: {} }),
        },
        item: vi.fn().mockReturnValue({
          replace: vi.fn().mockResolvedValue({ resource: {} }),
          delete: vi.fn().mockResolvedValue({}),
        }),
      }),
    }),
  })),
}));

describe('CosmosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('init creates database and containers', async () => {
    await cosmosService.init();
    expect(cosmosService.database.containers.createIfNotExists).toHaveBeenCalledTimes(2);
  });

  it('getTransactions queries all items', async () => {
    const mockResources = [{ id: '1', type: 'income' }];
    cosmosService.transactionsContainer.items.query().fetchAll.mockResolvedValue({ resources: mockResources });
    const result = await cosmosService.getTransactions();
    expect(result).toEqual(mockResources);
    expect(cosmosService.transactionsContainer.items.query).toHaveBeenCalledWith({
      query: 'SELECT * FROM c',
    });
  });

  it('addTransaction creates item', async () => {
    const transaction = { id: '1', type: 'income' };
    cosmosService.transactionsContainer.items.create.mockResolvedValue({ resource: transaction });
    const result = await cosmosService.addTransaction(transaction);
    expect(result).toBe(transaction);
  });

  it('updateTransaction replaces item', async () => {
    const transaction = { id: '1', type: 'income' };
    cosmosService.transactionsContainer.item().replace.mockResolvedValue({ resource: transaction });
    const result = await cosmosService.updateTransaction('1', transaction);
    expect(result).toBe(transaction);
  });

  it('deleteTransaction deletes item', async () => {
    await cosmosService.deleteTransaction('1', 'income');
    expect(cosmosService.transactionsContainer.item().delete).toHaveBeenCalled();
  });

  it('getChatHistory queries ordered items for userId', async () => {
    const mockResources = [{ id: '1', userId: 'user1', timestamp: '2023-01-01' }];
    cosmosService.chatsContainer.items.query().fetchAll.mockResolvedValue({ resources: mockResources });
    const result = await cosmosService.getChatHistory('user1');
    expect(result).toEqual(mockResources);
    expect(cosmosService.chatsContainer.items.query).toHaveBeenCalledWith({
      query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.timestamp',
      parameters: [{ name: '@userId', value: 'user1' }],
    });
  });

  it('addChatMessage creates item', async () => {
    const message = { id: '1', userId: 'user1' };
    cosmosService.chatsContainer.items.create.mockResolvedValue({ resource: message });
    const result = await cosmosService.addChatMessage(message);
    expect(result).toBe(message);
  });

  it('deleteChatHistory deletes all user messages', async () => {
    const mockResources = [{ id: '1', userId: 'user1' }, { id: '2', userId: 'user1' }];
    cosmosService.chatsContainer.items.query().fetchAll.mockResolvedValue({ resources: mockResources });
    await cosmosService.deleteChatHistory('user1');
    expect(cosmosService.chatsContainer.item().delete).toHaveBeenCalledTimes(2);
  });
});
