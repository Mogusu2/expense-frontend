// src/pages/Reports.jsx
import { useState } from 'react';
import { Container, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import axios from 'axios';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [category, setCategory] = useState('');
  const [timeframe, setTimeframe] = useState(30);

  const generateReport = async () => {
    try {
      const { data } = await axios.get('/api/reports', {
        params: { category, timeframe }
      });
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Financial Reports</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            label="Timeframe"
          >
            <MenuItem value={7}>7 Days</MenuItem>
            <MenuItem value={30}>30 Days</MenuItem>
            <MenuItem value={90}>90 Days</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={generateReport}>
          Generate Report
        </Button>
      </Box>

      {reportData && (
        {/* Add report visualization components here */}
      )}
    </Container>
  );
}
