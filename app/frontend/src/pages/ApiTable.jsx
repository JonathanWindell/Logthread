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
function ApiTable() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const ApiResponse = await fetch('http://localhost:8000/api/logs');
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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Log ID</TableCell>
            <TableCell align="right">Timestamp</TableCell>
            <TableCell align="right">Log level</TableCell>
            <TableCell align="right">Log message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.log_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                
              </TableCell>
              <TableCell align="right">{row.log_id}</TableCell>
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



    
    
    
  