import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, TextField, Button, MenuItem, Select, 
  FormControl, InputLabel
} from '@mui/material';
import { useSnackbar } from 'notistack';

const PaymentMethods = ({ invoices, onPayment }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    amount: '',
    invoiceId: '',
    method: 'mpesa',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onPayment(
        state.method,
        Number(state.amount),
        state.invoiceId,
        state.phone
      );
      setState({ amount: '', invoiceId: '', method: 'mpesa', phone: '' });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Invoice</InputLabel>
        <Select
          value={state.invoiceId}
          onChange={e => setState(prev => ({ ...prev, invoiceId: e.target.value }))}
          label="Invoice"
        >
          {invoices.map(invoice => (
            <MenuItem key={invoice.id} value={invoice.id}>
              #{invoice.id} - ${invoice.total}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Amount"
        type="number"
        fullWidth
        value={state.amount}
        onChange={e => setState(prev => ({ ...prev, amount: e.target.value }))}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={state.method}
          onChange={e => setState(prev => ({ ...prev, method: e.target.value }))}
          label="Payment Method"
        >
          <MenuItem value="mpesa">M-Pesa</MenuItem>
          <MenuItem value="paypal">PayPal</MenuItem>
        </Select>
      </FormControl>

      {state.method === 'mpesa' && (
        <TextField
          label="Phone Number"
          fullWidth
          value={state.phone}
          onChange={e => setState(prev => ({ ...prev, phone: e.target.value }))}
          sx={{ mb: 2 }}
        />
      )}

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        disabled={!state.amount || !state.invoiceId || (state.method === 'mpesa' && !state.phone)}
      >
        Process {state.method.toUpperCase()} Payment
      </Button>
    </Box>
  );
};
PaymentMethods.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired
    })
  ).isRequired,
  onPayment: PropTypes.func.isRequired
};

export default PaymentMethods;