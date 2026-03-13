import React from 'react';
import { useState, useEffect } from 'react';
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
 * ApiTable
 *
 * Fetches and displays application log entries in a Material-UI table.
 *
 * The component performs the following steps:
 * 1. On mount, fetches log data from the configured API endpoint.
 * 2. Stores the retrieved logs in local state.
 * 3. Renders a loading spinner while the request is in-flight.
 * 4. Renders an error message if the request fails.
 * 5. Renders an empty-state message if no logs are returned.
 * 6. Renders the full log table once data is available.
 *
 * State:
 *   data    {Array}   - List of log objects retrieved from the API.
 *   loading {boolean} - Whether the fetch request is currently pending.
 *   error   {string|null} - Error message string if the request failed, otherwise null.
 *
 * Returns:
 *   JSX.Element - A responsive Material-UI TableContainer with log rows,
 *                 or a feedback element (spinner / error / empty message).
 */
function ApiTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * useEffect — Data Fetching on Mount
     *
     * Executes once when the component is first rendered (empty dependency array).
     * Sends a GET request to the /api/logs endpoint and populates component state.
     *
     * Steps:
     * 1. Calls the API using the base URL defined in the VITE_API_BASE_URL env variable.
     * 2. Throws an error if the HTTP response status is not OK.
     * 3. Parses the JSON response and stores the logs array in state.
     * 4. Catches and stores any network or parsing errors in the error state.
     * 5. Sets loading to false in the finally block regardless of outcome.
     */
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`);
          if (!ApiResponse.ok) {
            throw new Error('Something went wrong');
          }
          const jsonData = await ApiResponse.json();
          setData(jsonData.logs);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    /**
     * formatDate
     *
     * Converts an ISO 8601 timestamp string into a human-readable Swedish locale format.
     *
     * Steps:
     * 1. Parses the ISO string into a JavaScript Date object.
     * 2. Formats it using the 'sv-SE' locale (YYYY-MM-DD HH:MM:SS).
     *
     * Args:
     *   isoString {string} - An ISO 8601 date-time string (e.g. "2024-01-15T08:30:00.000Z").
     *
     * Returns:
     *   {string} - A formatted date-time string in Swedish locale format.
     */
    const formatDate = (isoString) => {
      return new Date(isoString).toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    /* ── Early-return guards ───────────────────────────────────────────────── */

    // Show a spinner while the API request is still pending.
    if (loading) {
      return <CircularProgress />;
    }

    // Display an error message if the API request failed.
    if (error) {
      return <Typography color="error">{error}</Typography>;
    }

    // Display a fallback message when the API returns an empty log list.
    if (data.length === 0) {
      return <Typography>No data available</Typography>;
    }

    /* ── Main render ───────────────────────────────────────────────────────── */

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">

          {/* Table header — defines column labels for the log entries */}
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Log ID</TableCell>
              <TableCell align="right">Timestamp</TableCell>
              <TableCell align="right">Log level</TableCell>
              <TableCell align="right">Log message</TableCell>
            </TableRow>
          </TableHead>

          {/* Table body — iterates over the logs array and renders one row per entry */}
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.log_id}
                // Remove the bottom border on the last row for a cleaner table edge.
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* ID cell is intentionally left empty — no value is provided by the API */}
                <TableCell component="th" scope="row"></TableCell>

                <TableCell align="right">{row.log_id}</TableCell>

                {/* Timestamp is formatted from ISO 8601 to Swedish locale before display */}
                <TableCell align="right">{formatDate(row.timestamp)}</TableCell>

                <TableCell align="right">{row.level}</TableCell>
                <TableCell align="right">{row.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    );
}

export default ApiTable;