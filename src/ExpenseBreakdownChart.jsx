import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function getExpenseBreakdown(transactions) {
  const breakdown = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    }
  });
  return breakdown;
}

const ExpenseBreakdownChart = ({ transactions }) => {
  const breakdown = getExpenseBreakdown(transactions);
  const data = {
    labels: Object.keys(breakdown),
    datasets: [
      {
        data: Object.values(breakdown),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        hoverOffset: 4
      }
    ]
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Expense Breakdown (Chart)</h2>
      <Pie data={data} />
    </div>
  );
};

export default ExpenseBreakdownChart;
