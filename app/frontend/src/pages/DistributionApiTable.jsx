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
 * DistributionApiTable
 *
 * Fetches and displays a statistical breakdown of log entries grouped by severity level.
 * Each row shows the count and percentage share for one log level, ordered by severity.
 * A totals row is appended at the bottom of the table.
 *
 * The component performs the following steps:
 * 1. On mount, fetches log statistics from the configured API endpoint.
 * 2. Extracts the stats object from the JSON response and stores it in local state.
 * 3. Renders a loading spinner while the request is in-flight.
 * 4. Renders an error message if the request fails.
 * 5. Renders an empty-state message if the stats object contains no entries.
 * 6. Renders one table row per log level (in fixed severity order) plus a totals row.
 *
 * State:
 *   stats   {Object}     - Key-value map of log level to entry count (e.g. { ERROR: 42 }).
 *   loading {boolean}    - Whether the fetch request is currently pending.
 *   error   {string|null} - Error message string if the request failed, otherwise null.
 *
 * Returns:
 *   JSX.Element - A Material-UI TableContainer with per-level distribution rows and a
 *                 totals row, or a feedback element (spinner / error / empty message).
 */
function DistributionApiTable() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * useEffect — Statistics Fetching on Mount
     *
     * Executes once when the component is first rendered (empty dependency array).
     * Sends a GET request to the /api/logs endpoint and extracts the stats payload.
     *
     * Steps:
     * 1. Calls the API using the base URL defined in the VITE_API_BASE_URL env variable.
     * 2. Throws an error if the HTTP response status is not OK.
     * 3. Destructures the stats field from the JSON response and stores it in state.
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
                const { stats } = await response.json();
                setStats(stats);
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

    // Display a fallback message when the API returns an empty stats object.
    if (Object.keys(stats).length === 0) {
        return <Typography>No log statistics available</Typography>;
    }

    /* ── Derived data ──────────────────────────────────────────────────────── */

    /**
     * logLevelOrder
     *
     * Fixed array that defines the display order of log levels from least
     * to most severe. Levels absent from the stats object will render with a count of 0.
     */
    const logLevelOrder = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

    /* ── Main render ───────────────────────────────────────────────────────── */

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="log statistics table">

                {/* Table header — defines column labels for level, count, and percentage */}
                <TableHead>
                    <TableRow>
                        <TableCell>Log Level</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/*
                     * Per-level rows — iterates over logLevelOrder and renders one row per level.
                     *
                     * For each level:
                     * 1. Looks up the count from the stats object (defaults to 0 if absent).
                     * 2. Sums all stat values to derive the total log count.
                     * 3. Calculates this level's percentage share, rounded to one decimal place.
                     */}
                    {logLevelOrder.map(level => {
                        const count = stats[level] || 0;
                        const total = Object.values(stats).reduce((sum, val) => sum + val, 0);

                        // Calculate the percentage share for this log level, guarding against division by zero.
                        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) + '%' : '0%';

                        return (
                            <TableRow key={level}>
                                <TableCell component="th" scope="row">{level}</TableCell>
                                <TableCell align="right">{count}</TableCell>
                                <TableCell align="right">{percentage}</TableCell>
                            </TableRow>
                        );
                    })}

                    {/* Totals row — sums all level counts and always displays 100% for the percentage */}
                    <TableRow>
                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {Object.values(stats).reduce((sum, val) => sum + val, 0)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DistributionApiTable;