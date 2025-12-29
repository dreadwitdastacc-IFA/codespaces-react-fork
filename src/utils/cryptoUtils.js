// cryptoUtils.js - Utility functions for cryptocurrency operations

import * as bitcoin from 'bitcoinjs-lib';
import createHash from 'create-hash';

// Define network parameters for supported cryptocurrencies
const networks = {
  bitcoin: bitcoin.networks.bitcoin,
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32, // P2SH addresses start with '3'
    wif: 0xb0,
  },
  dogecoin: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bech32: 'doge', // Dogecoin doesn't use bech32 for P2WSH, but for consistency
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16, // P2SH start with '9' or 'A'
    wif: 0x9e,
  },
  // Note: Ethereum, BNB, Solana, Cardano use different multisig implementations (smart contracts)
  // Not supported here as they don't use Bitcoin-style scripts
};

/**
 * Generates a m-of-n multisig redeem script in hex format
 * @param {string[]} pubkeys - Array of public keys in hex (compressed, 66 chars each)
 * @param {number} threshold - Number of signatures required (m)
 * @returns {string} The redeem script in hex
 */
export function generateMultisigScript(pubkeys, threshold) {
  if (pubkeys.length < threshold || threshold < 1) {
    throw new Error('Invalid threshold or pubkey count');
  }
  let script = (0x50 + threshold).toString(16).padStart(2, '0'); // OP_m
  pubkeys.forEach(pk => {
    script += '21' + pk; // OP_DATA_33 + pubkey
  });
  script += (0x50 + pubkeys.length).toString(16).padStart(2, '0'); // OP_n
  script += 'ae'; // OP_CHECKMULTISIG
  return script;
}

/**
 * Generates a P2SH address from a redeem script
 * @param {string} redeemScriptHex - The redeem script in hex
 * @param {string} coin - The cryptocurrency ('bitcoin', 'litecoin', 'dogecoin')
 * @param {boolean} isTestnet - Whether to use testnet (default: false for mainnet)
 * @returns {string} The P2SH address
 */
export function generateP2SHAddress(redeemScriptHex, coin = 'litecoin', isTestnet = false) {
  const network = isTestnet ? getTestnetNetwork(coin) : networks[coin];
  if (!network) throw new Error(`Unsupported coin: ${coin}`);
  const redeemScript = Buffer.from(redeemScriptHex, 'hex');
  const scriptPubKey = bitcoin.script.compile([
    bitcoin.opcodes.OP_HASH160,
    bitcoin.crypto.hash160(redeemScript),
    bitcoin.opcodes.OP_EQUAL,
  ]);
  return bitcoin.address.fromOutputScript(scriptPubKey, network);
}

/**
 * Generates a P2WSH address from a redeem script
 * @param {string} redeemScriptHex - The redeem script in hex
 * @param {string} coin - The cryptocurrency ('bitcoin', 'litecoin', 'dogecoin')
 * @param {boolean} isTestnet - Whether to use testnet (default: false for mainnet)
 * @returns {string} The P2WSH address
 */
export function generateP2WSHAddress(redeemScriptHex, coin = 'litecoin', isTestnet = false) {
  const network = isTestnet ? getTestnetNetwork(coin) : networks[coin];
  if (!network) throw new Error(`Unsupported coin: ${coin}`);
  const redeemScript = Buffer.from(redeemScriptHex, 'hex');
  const sha256 = createHash('sha256').update(redeemScript).digest();
  const scriptPubKey = bitcoin.script.compile([
    bitcoin.opcodes.OP_0,
    sha256,
  ]);
  return bitcoin.address.fromOutputScript(scriptPubKey, network);
}

/**
 * Get testnet network for a coin
 * @param {string} coin - The cryptocurrency
 * @returns {object} Testnet network params
 */
function getTestnetNetwork(coin) {
  const testnets = {
    bitcoin: bitcoin.networks.testnet,
    litecoin: {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bech32: 'tltc',
      bip32: { public: 0x043587cf, private: 0x04358394 },
      pubKeyHash: 0x6f,
      scriptHash: 0x3a,
      wif: 0xef,
    },
    dogecoin: {
      messagePrefix: '\x19Dogecoin Signed Message:\n',
      bech32: 'tdoge',
      bip32: { public: 0x043587cf, private: 0x04358394 }, // Dogecoin testnet uses same as Litecoin
      pubKeyHash: 0x71,
      scriptHash: 0xc4,
      wif: 0xf1,
    },
  };
  return testnets[coin];
}

/**
 * Validates a compressed public key
 * @param {string} pubkey - Public key in hex
 * @returns {boolean} True if valid compressed pubkey
 */
export function isValidCompressedPubkey(pubkey) {
  if (pubkey.length !== 66) return false;
  if (!pubkey.startsWith('02') && !pubkey.startsWith('03')) return false;
  // Basic hex validation
  return /^[0-9a-fA-F]+$/.test(pubkey);
}
