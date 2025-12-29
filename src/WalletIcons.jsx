import React from "react";
import PropTypes from "prop-types";

export const walletIcons = {
  litecoin: "⚡️",
  bitcoin: "₿",
  ethereum: "Ξ",
  dogecoin: "Ð",
  bnb: "🟡",
  solana: "◎",
  cardano: "₳",
};

export default function WalletIcon({ type, size = 24 }) {
  return (
    <span style={{ fontSize: size, marginRight: 6 }} title={type}>
      {walletIcons[type] || "💼"}
    </span>
  );
}

WalletIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
};
