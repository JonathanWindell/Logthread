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

// Component for displaying log level distribution statistics
function DistributionApiTable() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch log statistics from API on component mount
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

    // Handle loading and error states
    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (Object.keys(stats).length === 0) {
        return <Typography>No log statistics available</Typography>;
    }

    // Display log levels in severity order
    const logLevelOrder = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="log statistics table">
                <TableHead>
                    <TableRow>
                        <TableCell>Log Level</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logLevelOrder.map(level => {
                        const count = stats[level] || 0;
                        const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
                        // Calculate percentage for each log level
                        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) + '%' : '0%';
                        
                        return (
                            <TableRow key={level}>
                                <TableCell component="th" scope="row">
                                    {level}
                                </TableCell>
                                <TableCell align="right">{count}</TableCell>
                                <TableCell align="right">{percentage}</TableCell>
                            </TableRow>
                        );
                    })}
                    {/* Total row at bottom */}
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