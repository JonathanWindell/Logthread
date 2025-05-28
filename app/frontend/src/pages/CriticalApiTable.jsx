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


function CriticalApiTable() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const ApiResponse = await fetch('http://localhost:8000/api/logs'); /*Ändra till criticalEndpoint*/
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

}
