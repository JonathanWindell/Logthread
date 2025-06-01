import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import ApiTable from './ApiTable'
import CriticalApiTable from './CriticalApiTable'
import DistributionApiTable from './DistributionApiTable';
import Exporting from './Exporting';


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
    <div className="dashboard-header">
      <h1>Dashboard</h1>
    </div>
    
    <div className="welcome-message">
      <h2>Welcome, {auth.user?.profile.email}!</h2>
      <p>Log Dashboard</p>
    </div>

    <div className="Exporting">
      <Exporting />
    </div>

    <div className="critical-logs critical-table">
      <h3>Critical Logs</h3>
      <CriticalApiTable />
    </div>
    
    <div className="log-distribution stats-table">
      <h3>Log Distribution</h3>
      <DistributionApiTable />
    </div>

    <div className="api-section log-table">
      <h3>Log Feed</h3>
      <ApiTable />
    </div>

    <div className="logout-section">
      <button className="btn-logout" onClick={signOut}>Logga ut</button>
    </div>
  </div>
  );
}

export default Dashboard;