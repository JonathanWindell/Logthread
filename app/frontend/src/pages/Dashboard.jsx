import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import ApiTable from './ApiTable'
import CriticalApiTable from './CriticalApiTable'


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
      <h3>Log Feed</h3>
      <div>
        <ApiTable />
      </div>
    </div>
    <div className="critical-logs">
      <h3>Critical Logs</h3>
      <div>
        <CriticalApiTable />
      </div>
      
    </div>
      <button className="btn-logout" onClick={signOut}>Logga ut</button>
    </div>
  );
}

export default Dashboard;