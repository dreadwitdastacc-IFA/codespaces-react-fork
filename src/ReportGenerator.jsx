import React from 'react';
import PropTypes from 'prop-types';

function generateReport(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  return {
    totalIncome: income,
    totalExpense: expense,
    net: income - expense,
    count: transactions.length,
  };
}

const ReportGenerator = ({ transactions }) => {
  const report = generateReport(transactions);
  return (
    <div>
      <h2>Summary Report</h2>
      <ul>
        <li>Total Income: ${report.totalIncome}</li>
        <li>Total Expense: ${report.totalExpense}</li>
        <li>Net Profit/Loss: ${report.net}</li>
        <li>Transaction Count: {report.count}</li>
      </ul>
    </div>
  );
};

ReportGenerator.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default ReportGenerator;
