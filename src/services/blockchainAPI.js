export async function fetchETH(address) {
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${process.env.ETHERSCAN_KEY}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchTransactionsETH(address, limit = 10) {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${process.env.ETHERSCAN_KEY}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchGasPriceETH() {
  const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_KEY}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchSOL(address) {
  const url = `https://public-api.solscan.io/account/${address}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchTransactionsSOL(address, limit = 10) {
  const url = `https://public-api.solscan.io/account/transactions?account=${address}&limit=${limit}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchBTC(address) {
  const url = `https://mempool.space/api/address/${address}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchBlockscan(address) {
  const url = `https://blockscan.com/address/${address}?__data.json`;
  const res = await fetch(url);
  return res.json();
}
