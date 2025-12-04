import React from 'react';

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

export default ExpenseBreakdown;
