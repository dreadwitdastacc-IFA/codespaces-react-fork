const { keccak256 } = require('js-sha3');

/**
 * Return keccak256 hex digest for the given input string.
 * @param {string} input
 * @returns {string} hex digest
 */
function keccak256Hex(input) {
  return keccak256(String(input));
}

module.exports = { keccak256Hex };
