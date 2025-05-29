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
      <h2>Welcome, {auth.user?.profile.email}!</h2>
      <p>Log Dashboard</p>
  
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
            
      <div className="log-distribution">
        <h3>Log Distribution</h3>
          <div className="distribution-container">
            <p>Debug</p>
            <p>Info</p>
            <p>Warning</p>
            <p>Error</p>
            <p>Critical</p>
          </div>
      </div>

      <button className="btn-logout" onClick={signOut}>Logga ut</button>
    </div>
  );
}

export default Dashboard;