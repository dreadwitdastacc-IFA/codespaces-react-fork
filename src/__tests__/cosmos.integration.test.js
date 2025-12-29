import { describe, it, expect, beforeAll } from 'vitest';

const { createContainerIfNotExists, createItem, deleteItem } = require('../config/cosmosConfig');

let hasEmulator = false;

beforeAll(async () => {
  try {
    await createContainerIfNotExists();
    hasEmulator = true;
  } catch (e) {
    // Emulator not available; integration tests will be skipped
    // eslint-disable-next-line no-console
    console.warn('Cosmos emulator not available, skipping integration tests:', e.message || e);
  }
});

it('creates and deletes an item in the Cosmos emulator (if available)', async () => {
  if (!hasEmulator) return;
  const partitionKey = 'integration-test-user';
  const item = { userId: partitionKey, payload: 'integration-test' };
  const created = await createItem(item, partitionKey);
  expect(created).toBeTruthy();
  expect(created).toHaveProperty('id');
  // cleanup
  await deleteItem(created.id, partitionKey);
});
