import React from 'react';
import PropTypes from 'prop-types';

function calculateNetProfit(transactions) {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);
}

const ProfitLossSummary = ({ transactions }) => {
  const net = calculateNetProfit(transactions);
  return (
    <div>
      <h2>Net Profit/Loss</h2>
      <p>{net >= 0 ? 'Profit' : 'Loss'}: ${Math.abs(net)}</p>
    </div>
  );
};

ProfitLossSummary.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default ProfitLossSummary;
