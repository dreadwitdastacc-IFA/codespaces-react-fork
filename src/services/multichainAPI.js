import { fetchETH } from './chains/eth.js';
import { fetchSOL } from './chains/sol.js';
import { fetchBNB } from './chains/bnb.js';

export async function fetchMultichain(addresses) {
  return {
    eth: await fetchETH(addresses.eth),
    sol: await fetchSOL(addresses.sol),
    bnb: await fetchBNB(addresses.bnb),
  };
}
