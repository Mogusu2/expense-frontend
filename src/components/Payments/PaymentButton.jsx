// src/components/Payments/PaymentButton.jsx
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from '@mui/material';
import axios from 'axios';

const PaymentButton = ({ invoice }) => {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('paypal');
  const [phone, setPhone] = useState('');

  const handlePayment = async () => {
    try {
      if (method === 'paypal') {
        const { data } = await axios.post('/api/payments/paypal', { invoice_id: invoice.id });
        window.location.href = data.approval_url;
      } else if (method === 'mpesa') {
        await axios.post('/api/payments/mpesa', { 
          invoice_id: invoice.id,
          phone_number: phone 
        });
        alert('Payment request sent to your phone');
      }
      setOpen(false);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Pay Now
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Payment Method</DialogTitle>
        <DialogContent>
          <Select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value="paypal">PayPal</MenuItem>
            <MenuItem value="mpesa">M-Pesa</MenuItem>
          </Select>

          {method === 'mpesa' && (
            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};