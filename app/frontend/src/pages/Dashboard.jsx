import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  /*Sign out function*/
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

      <div>
        {logs.map((logs) => (
          <img key={logs.id} src={logs.url} alt={logs.title} />
      ))}
      </div>
    </div>
  
      <button className="btn-logout" onClick={signOut}>Logga ut</button>
    </div>
  );
}

export default Dashboard;