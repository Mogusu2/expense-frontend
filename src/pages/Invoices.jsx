// src/pages/Invoices.jsx
import { useState, useEffect } from 'react';
import { Button, Container, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import InvoiceForm from '../components/Invoices/InvoiceForm';
import axios from 'axios';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get('/api/invoices');
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    fetchInvoices();
  }, []);

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const { data } = await axios.post('/api/invoices', invoiceData);
      setInvoices([...invoices, data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Invoices</Typography>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          Create New Invoice
        </Button>
      </Grid>

      {showForm && (
        <InvoiceForm 
          onSubmit={handleCreateInvoice} 
          onCancel={() => setShowForm(false)}
        />
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Client</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.client_name}</TableCell>
              <TableCell>${invoice.total}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};