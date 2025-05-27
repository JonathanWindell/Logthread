import React from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  const signOut = () => {
    auth.removeUser();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <h2>Välkommen, {auth.user?.profile.email}!</h2>
      <p>Du är nu inloggad och kan se din dashboard.</p>
  
    <div className="api-section">
      <h3>API Data</h3>
      <p>Här kommer data från ditt backend att visas...</p>
    </div>
  
      <button className="btn-logout" onClick={signOut}>Logga ut</button>
    </div>
  );
}

export default Dashboard;