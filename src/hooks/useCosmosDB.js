/**
 * Custom React hook for interacting with Azure Cosmos DB.
 * Initializes the Cosmos DB container on mount and provides methods for CRUD operations,
 * as well as specific functions for storing and fetching chat messages.
 * Extended to include wallet linking for blockchain integration and payload retrieval.
 *
 * @returns {Object} An object containing:
 * - {Object|null} container - The Cosmos DB container instance.
 * - {boolean} loading - Indicates if the initialization is in progress.
 * - {string|null} error - Error message if initialization failed.
 * - {Function} storeMessage - Function to store a chat message. Takes userId and message.
 * - {Function} fetchChatHistory - Function to fetch chat history. Takes userId and optional limit.
 * - {Function} createItem - Function to create a new item. Takes item and partitionKey.
 * - {Function} updateItem - Function to update an existing item. Takes itemId, updatedItem, and partitionKey.
 * - {Function} deleteItem - Function to delete an item. Takes itemId and partitionKey.
 * - {string|null} walletAddress - Connected wallet address.
 * - {boolean} walletConnected - Indicates if wallet is connected.
 * - {Function} connectWallet - Function to connect a wallet.
 * - {Function} disconnectWallet - Function to disconnect the wallet.
 * - {Function} getPayloads - Function to retrieve payloads for the connected wallet. Takes optional limit.
 */
import { useState, useEffect, useCallback } from 'react';
import { initializeCosmosDB, storeChatMessage, getChatHistory, createItemWithRetry, updateItemWithRetry, deleteItemWithRetry, getPayloads } from '../config/cosmosConfig';
// Assuming ethers.js for wallet integration (install via npm if needed)
import { BrowserProvider } from 'ethers';

export function useCosmosDB() {
  const [container, setContainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Initialize Cosmos DB on mount
  useEffect(() => {
    const init = async () => {
      try {
        const { container: newContainer } = await initializeCosmosDB();
        setContainer(newContainer);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Connect wallet (Ethereum-based, using MetaMask or similar)
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask or compatible wallet not detected');
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setWalletConnected(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setWalletConnected(false);
  }, []);

  // Get payloads for connected wallet (assumes payloads stored in Cosmos DB partitioned by walletAddress)
  const getPayloadsCallback = useCallback(async (limit = 50) => {
    if (!container) throw new Error('Cosmos DB not initialized');
    if (!walletAddress) throw new Error('Wallet not connected');
    return await getPayloads(container, walletAddress, limit);
  }, [container, walletAddress]);

  // Store a chat message (for AI/chat use case)
  const storeMessage = useCallback(async (userId, message) => {
    if (!container) throw new Error('Cosmos DB not initialized');
    return await storeChatMessage(container, userId, message);
  }, [container]);

  // Get chat history (for AI/chat use case)
  const fetchChatHistory = useCallback(async (userId, limit = 50) => {
    if (!container) throw new Error('Cosmos DB not initialized');
    return await getChatHistory(container, userId, limit);
  }, [container]);

  // Generic create item
  const createItem = useCallback(async (item, partitionKey) => {
    if (!container) throw new Error('Cosmos DB not initialized');
    return await createItemWithRetry(container, item, partitionKey);
  }, [container]);

  // Generic update item
  const updateItem = useCallback(async (itemId, updatedItem, partitionKey) => {
    if (!container) throw new Error('Cosmos DB not initialized');
    return await updateItemWithRetry(container, itemId, updatedItem, partitionKey);
  }, [container]);

  // Generic delete item
  const deleteItem = useCallback(async (itemId, partitionKey) => {
    if (!container) throw new Error('Cosmos DB not initialized');
    return await deleteItemWithRetry(container, itemId, partitionKey);
  }, [container]);

  return { container, loading, error, storeMessage, fetchChatHistory, createItem, updateItem, deleteItem, walletAddress, walletConnected, connectWallet, disconnectWallet, getPayloads: getPayloadsCallback };
}
