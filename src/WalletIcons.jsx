import React from 'react';

export const walletIcons = {
  litecoin: '⚡️',
  bitcoin: '₿',
  ethereum: 'Ξ',
  dogecoin: 'Ð',
  bnb: '🟡',
  solana: '◎',
  cardano: '₳',
};

export default function WalletIcon({ type, size = 24 }) {
  return (
    <span style={{ fontSize: size, marginRight: 6 }} title={type}>
      {walletIcons[type] || '💼'}
    </span>
  );
}
