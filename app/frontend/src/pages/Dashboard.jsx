import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import ApiTable from './ApiTable'
import CriticalApiTable from './CriticalApiTable'
import DistributionApiTable from './DistributionApiTable';
import Exporting from './Exporting';
import S3ArchivedTable from './S3ArchivedTable';

function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs data on component mount for CSV/JSON export functionality
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`);
        if (!response.ok) throw new Error('Failed to fetch logs');
        const data = await response.json();
        setLogsData(data.logs || []);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);
  
  // Handle user logout - clear auth and redirect to home
  const signOut = () => {
    auth.removeUser();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
    <div className="dashboard-header">
      <h1>Dashboard</h1>
      <div className="log-dashboard">
        <p>Log Dashboard</p>
      </div>
    </div>
    
    {/* Display current user's email */}
    <div className="welcome-message">
      <p>Currently logged in as:<br>
      </br>{auth.user?.profile.email}</p>
    </div>

    {/* Export functionality for logs data */}
    <div className="export-section">
      <Exporting data={logsData} />
    </div>

    {/* Critical logs table */}
    <div className="critical-logs critical-table">
      <h3>Critical Logs</h3>
      <CriticalApiTable />
    </div>
    
    {/* Log level distribution statistics */}
    <div className="log-distribution stats-table">
      <h3>Log Distribution</h3>
      <DistributionApiTable />
    </div>

    {/* Main log feed table */}
    <div className="api-section log-table">
      <h3>Log Feed</h3>
      <ApiTable />
    </div>

    {/* S3 archived logs table */}
    <div className="S3-logs S3-table ">
      <h3>Archived Logs</h3>
      <S3ArchivedTable />
    </div>

    {/* Logout button */}
    <div className="logout-section">
      <button className="btn-logout" onClick={signOut}>Logga ut</button>
    </div>
  </div>
  );
}

export default Dashboard;