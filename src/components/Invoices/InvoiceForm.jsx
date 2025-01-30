// src/components/Invoices/InvoiceForm.jsx
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';

const validationSchema = Yup.object({
  client_name: Yup.string().required('Client name is required'),
  client_email: Yup.string().email('Invalid email').required('Email is required'),
  items: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required('Item description required'),
      amount: Yup.number().min(0.01, 'Amount must be positive').required('Required')
    })
  ).min(1, 'At least one item required')
});

export default function InvoiceForm({ open, onClose, onInvoiceCreated }) {
  const [submitting, setSubmitting] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      client_name: '',
      client_email: '',
      items: [{ description: '', amount: '' }]
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.post('/api/invoices', 
          {
            client_name: values.client_name,
            client_email: values.client_email,
            items: values.items.map(item => ({
              description: item.description,
              amount: parseFloat(item.amount)
            }))
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        onInvoiceCreated(data);
        onClose();
      } catch (error) {
        console.error('Invoice creation failed:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const totalAmount = formik.values.items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  const handleAddItem = () => {
    formik.setFieldValue('items', [...formik.values.items, { description: '', amount: '' }]);
  };

  const handleRemoveItem = (index) => {
    formik.setFieldValue('items', formik.values.items.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Invoice</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Client Name"
                name="client_name"
                value={formik.values.client_name}
                onChange={formik.handleChange}
                error={formik.touched.client_name && Boolean(formik.errors.client_name)}
                helperText={formik.touched.client_name && formik.errors.client_name}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Client Email"
                name="client_email"
                type="email"
                value={formik.values.client_email}
                onChange={formik.handleChange}
                error={formik.touched.client_email && Boolean(formik.errors.client_email)}
                helperText={formik.touched.client_email && formik.errors.client_email}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Invoice Items
              </Typography>
              
              {formik.values.items.map((item, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Description"
                      name={`items[${index}].description`}
                      value={item.description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.items?.[index]?.description && 
                        Boolean(formik.errors.items?.[index]?.description)
                      }
                      helperText={
                        formik.touched.items?.[index]?.description && 
                        formik.errors.items?.[index]?.description
                      }
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Amount"
                      name={`items[${index}].amount`}
                      type="number"
                      value={item.amount}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.items?.[index]?.amount && 
                        Boolean(formik.errors.items?.[index]?.amount)
                      }
                      helperText={
                        formik.touched.items?.[index]?.amount && 
                        formik.errors.items?.[index]?.amount
                      }
                    />
                  </Grid>
                  
                  <Grid item xs={2}>
                    {index > 0 && (
                      <IconButton onClick={() => handleRemoveItem(index)}>
                        <RemoveIcon color="error" />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                sx={{ mt: 2 }}
              >
                Add Item
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ textAlign: 'right' }}>
                Total: ${totalAmount.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={submitting || !formik.isValid}
        >
          {submitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}