import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import AppContent from "./AppContent";
import defaultTransactions from "./data/transactions";

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

  return user ? <AppContent initialTransactions={initialTransactions} /> : <Login />;
}

export default App;
