import React from 'react';
import PropTypes from 'prop-types';

function getExpenseBreakdown(transactions) {
  const breakdown = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    }
  });
  return breakdown;
}

const ExpenseBreakdown = ({ transactions }) => {
  const breakdown = getExpenseBreakdown(transactions);
  return (
    <div>
      <h2>Expense Breakdown</h2>
      <ul>
        {Object.entries(breakdown).map(([cat, amt]) => (
          <li key={cat}>{cat}: ${amt}</li>
        ))}
      </ul>
    </div>
  );
};

ExpenseBreakdown.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default ExpenseBreakdown;
