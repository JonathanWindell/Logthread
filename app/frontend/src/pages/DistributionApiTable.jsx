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

/*Fetching data from API*/
function DistributionApiTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const urls = [
        'http://localhost:8000/api/logs/level/DEBUG',
        'http://localhost:8000/api/logs/level/INFO',
        'http://localhost:8000/api/logs/level/WARNING',
        'http://localhost:8000/api/logs/level/ERROR',
        'http://localhost:8000/api/logs/level/CRITICAL'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const promises = urls.map(async (url) => {
                    try {
                        const response = await fetch(url); 
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const jsonData = await response.json();
                        return { url, data: jsonData, status: 'success' };
                    } catch (error) {
                        return { url, error: error.message, status: 'failed' };
                    }
                });

                const results = await Promise.allSettled(promises);
                
                const successfulResults = [];
                const errors = [];
                
                results.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        if (result.value.status === 'success') {
                            successfulResults.push(result.value);
                            console.log(`${result.value.url}:`, result.value.data);
                        } else {
                            errors.push(result.value);
                            console.error(`${result.value.url}:`, result.value.error);
                        }
                    }
                });

                setData(successfulResults); 
                
                if (errors.length > 0 && successfulResults.length === 0) {
                    setError('Alla endpoints misslyckades');
                } else if (errors.length > 0) {
                    console.warn(`${errors.length} av ${urls.length} endpoints misslyckades`);
                }
                
            } catch (error) {
                setError('Ett oväntat fel inträffade: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); 

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (data.length === 0) {
        return <Typography>No data available</Typography>;
    }

    // Render based on result
    return (
        <div>
            {data.map((result, index) => (
                <div key={index}>
                    <Typography variant="h6">
                        {result.url.split('/').pop()} Logs
                    </Typography>
                    {/* Här kan du rendera en tabell för varje log-level */} 
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
            ))}
        </div>
    );
}

export default DistributionApiTable