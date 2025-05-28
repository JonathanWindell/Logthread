import React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/*Fetching data from API*/
function ApiTable() {
    useEffect(() => {
    const fetchData = async () => {
      try {
        const ApiResponse = await fetch('https://api.example.com/data');
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        const jsonData = await ApiResponse.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="enkel tabell">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Namn</TableCell>
            <TableCell align="right">Ålder</TableCell>
            <TableCell align="right">E-post</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.log_id}</TableCell>
              <TableCell align="right">{row.timestamp}</TableCell>
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



    
    
    
  