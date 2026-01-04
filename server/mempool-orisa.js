export function classifyOrisa(chain, data) {
  if (chain === "btc" && data.fee > 10000) {
    return { orisa: "Ṣàngó", reason: "high_fee_volatility" };
  }

  if (chain === "btc" && data.vsize > 1000000) {
    return { orisa: "Ọ̀ṣun", reason: "large_transaction_flow" };
  }

  if (chain === "eth" && data.gasPrice > 80) {
    return { orisa: "Ṣàngó", reason: "high_gas_volatility" };
  }

  if (chain === "bnb" && data.liquidity > 10000000) {
    return { orisa: "Ọ̀ṣun", reason: "abundant_flow" };
  }

  if (chain === "sol" && data.tps > 3000) {
    return { orisa: "Ọya", reason: "network_storm" };
  }

  return { orisa: null, reason: "baseline" };
}
