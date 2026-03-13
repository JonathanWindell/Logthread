import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import ApiTable from './ApiTable';
import CriticalApiTable from './CriticalApiTable';
import DistributionApiTable from './DistributionApiTable';
import Exporting from './Exporting';
import S3ArchivedTable from './S3ArchivedTable';

/**
 * Dashboard
 *
 * Main protected view rendered after a user has successfully authenticated.
 * Aggregates all log-related components and provides export and sign-out functionality.
 *
 * The component performs the following steps:
 * 1. Reads the current OIDC auth session to display the logged-in user's email.
 * 2. On mount, fetches all log entries from the API to supply the export feature.
 * 3. Exposes a signOut handler that clears the OIDC session and redirects to home.
 * 4. Renders four data sections: critical logs, log distribution, log feed, and archived logs.
 * 5. Renders an export control and a logout button in the page layout.
 *
 * State:
 *   logsData {Array}   - Full list of log objects fetched for CSV/JSON export.
 *   loading  {boolean} - Whether the initial log fetch is still in-flight.
 *
 * Returns:
 *   JSX.Element - A dashboard layout containing log tables, export controls,
 *                 user info, and a sign-out button.
 */
function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * useEffect — Log Data Fetching on Mount
   *
   * Executes once when the component is first rendered (empty dependency array).
   * Fetches the full log list solely to populate the export feature — individual
   * table components manage their own data fetching independently.
   *
   * Steps:
   * 1. Calls the /api/logs endpoint using the VITE_API_BASE_URL env variable.
   * 2. Throws an error if the HTTP response status is not OK.
   * 3. Parses the JSON response and stores the logs array (or an empty array) in state.
   * 4. Logs any network or parsing errors to the console.
   * 5. Sets loading to false in the finally block regardless of outcome.
   */
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

  /**
   * signOut
   *
   * Handles user logout by clearing the OIDC session and redirecting to the home page.
   *
   * Steps:
   * 1. Calls auth.removeUser() to remove the user session from the OIDC context.
   * 2. Navigates the user back to the "/" route via React Router.
   *
   * Returns:
   *   void
   */
  const signOut = () => {
    auth.removeUser();
    navigate('/');
  };

  /* ── Main render ───────────────────────────────────────────────────────── */

  return (
    <div className="dashboard-container">

      {/* Dashboard header — displays the page title and log dashboard label */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="log-dashboard">
          <p>Log Dashboard</p>
        </div>
      </div>

      {/* Welcome message — displays the authenticated user's OIDC profile email */}
      <div className="welcome-message">
        <p>Currently logged in as:<br />
          {auth.user?.profile.email}
        </p>
      </div>

      {/* Export section — renders export controls (CSV/JSON) fed by the fetched logsData */}
      <div className="export-section">
        <Exporting data={logsData} />
      </div>

      {/* Critical logs section — displays log entries filtered to CRITICAL severity */}
      <div className="critical-logs critical-table">
        <h3>Critical Logs</h3>
        <CriticalApiTable />
      </div>

      {/* Log distribution section — displays a breakdown of log counts per severity level */}
      <div className="log-distribution stats-table">
        <h3>Log Distribution</h3>
        <DistributionApiTable />
      </div>

      {/* Log feed section — displays the full unfiltered log entry table */}
      <div className="api-section log-table">
        <h3>Log Feed</h3>
        <ApiTable />
      </div>

      {/* Archived logs section — displays logs retrieved from S3 long-term storage */}
      <div className="S3-logs S3-table">
        <h3>Archived Logs</h3>
        <S3ArchivedTable />
      </div>

      {/* Logout section — triggers signOut which clears the session and redirects to home */}
      <div className="logout-section">
        <button className="btn-logout" onClick={signOut}>Logga ut</button>
      </div>

    </div>
  );
}

export default Dashboard;