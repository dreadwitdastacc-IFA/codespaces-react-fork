import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import AppContent from './AppContent';
import defaultTransactions from './data/transactions';
/**
 * @file App.jsx
 * @description Main application component. Renders the dashboard header and all main widgets.
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import ProfitLossSummary from "./ProfitLossSummary";
import ExpenseBreakdown from "./ExpenseBreakdown";
import ReportGenerator from "./ReportGenerator";

function App() {
  return (
    <AuthProvider>
      <AppWithAuth initialTransactions={defaultTransactions} />
    </AuthProvider>
  );
}

function AppWithAuth({ initialTransactions }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <AppContent initialTransactions={initialTransactions} />
  ) : (
    <Login />
  );
}

export default App;
