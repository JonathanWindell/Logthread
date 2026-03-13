import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography
} from '@mui/material';

/**
 * S3ArchivedTable
 *
 * Fetches and displays the total count of log entries that have been archived to S3.
 * Renders a single-row table showing the archived log count retrieved from the API.
 *
 * The component performs the following steps:
 * 1. On mount, fetches log metadata from the configured API endpoint.
 * 2. Extracts the archived_log_count field from the JSON response and stores it in state.
 * 3. Renders a loading spinner while the request is in-flight.
 * 4. Renders an error message if the request fails.
 * 5. Renders an empty-state message if the archived log count is zero.
 * 6. Renders a single-row table displaying the archived log count once data is available.
 *
 * State:
 *   archivedLogCount {number|null} - Total number of logs archived to S3,
 *                                    or null before the fetch completes.
 *   loading          {boolean}     - Whether the fetch request is currently pending.
 *   error            {string|null} - Error message string if the request failed, otherwise null.
 *
 * Returns:
 *   JSX.Element - A Material-UI TableContainer with a single archived log count row,
 *                 or a feedback element (spinner / error / empty message).
 */
function S3ArchivedTable() {
  const [archivedLogCount, setArchivedLogCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * useEffect — Archived Log Count Fetching on Mount
   *
   * Executes once when the component is first rendered (empty dependency array).
   * Sends a GET request to the /api/logs endpoint and extracts the S3 archive count.
   *
   * Steps:
   * 1. Calls the API using the base URL defined in the VITE_API_BASE_URL env variable.
   * 2. Throws an error if the HTTP response status is not OK.
   * 3. Parses the JSON response and stores the archived_log_count field in state.
   * 4. Catches and stores any network or parsing errors in the error state,
   *    and additionally logs them to the console for debugging.
   * 5. Sets loading to false in the finally block regardless of outcome.
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`);
        if (!response.ok) {
          throw new Error('Failed to fetch log statistics');
        }
        const data = await response.json();
        setArchivedLogCount(data.archived_log_count);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  /* ── Early-return guards ───────────────────────────────────────────────── */

  // Show a spinner while the API request is still pending.
  if (loading) {
    return <CircularProgress />;
  }

  // Display an error message if the API request failed.
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Display a fallback message when no logs have been archived to S3.
  if (archivedLogCount === 0) {
    return <Typography>No logs found in S3 archive</Typography>;
  }

  /* ── Main render ───────────────────────────────────────────────────────── */

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="S3 Archived Table">

        {/* Table header — defines column labels for the row ID and archived log count */}
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Archived logs to S3</TableCell>
          </TableRow>
        </TableHead>

        {/* Table body — renders a single row displaying the total S3 archived log count */}
        <TableBody>
          <TableRow>
            {/* Static row ID — this table always contains exactly one summary row */}
            <TableCell component="th" scope="row">1</TableCell>
            <TableCell align="right">{archivedLogCount}</TableCell>
          </TableRow>
        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default S3ArchivedTable;