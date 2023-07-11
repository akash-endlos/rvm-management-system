import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { fetchAllVendors } from '@/redux/reducers/vendorSlice';

// Define the options for inventry types and brands
const inventryTypeOptions = [
  { id: '1', name: 'Type 1' },
  { id: '2', name: 'Type 2' },
  { id: '3', name: 'Type 3' },
];

const inventryBrandOptions = {
  '1': [
    { id: '11', name: 'Brand 1.1' },
    { id: '12', name: 'Brand 1.2' },
    { id: '13', name: 'Brand 1.3' },
  ],
  '2': [
    { id: '21', name: 'Brand 2.1' },
    { id: '22', name: 'Brand 2.2' },
    { id: '23', name: 'Brand 2.3' },
  ],
  '3': [
    { id: '31', name: 'Brand 3.1' },
    { id: '32', name: 'Brand 3.2' },
    { id: '33', name: 'Brand 3.3' },
  ],
};

const schema = yup.object().shape({
  vendorId: yup.string().required('Vendor is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
  invoiceDate: yup.date().required('Invoice date is required'),
  inventryTypeId: yup.string().required('Inventry type is required'),
  inventryBrandId: yup.string().required('Inventry brand is required'),
});

const AddEditStockSidebar = ({ onClose, onSubmit, selectedVendor }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllVendors());
  }, []);

  const [inventryBrands, setInventryBrands] = useState([]);
  const handleInventryTypeChange = (event) => {
    const selectedTypeId = event.target.value;
    const brands = inventryBrandOptions[selectedTypeId] || [];
    setInventryBrands(brands);
    setValue('inventryBrandId', ''); // Reset the brand selection
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vendorId: selectedVendor?.vendorId || '',
      invoiceNumber: selectedVendor?.invoiceNumber || '',
      invoiceDate: selectedVendor?.invoiceDate || null,
      inventryTypeId: '',
      inventryBrandId: '',
    },
  });

  const handleFormSubmit = (data) => {
    // Check if invoiceDate is empty string
    if (!data.invoiceDate) {
      setValue('invoiceDate', null); // Set invoiceDate to null
    }
    onSubmit(data);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '500px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
          Stock
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Select
              fullWidth
              label="Vendor"
              name="vendorId"
              {...register('vendorId')}
              error={!!errors.vendorId}
            >
              <MenuItem value="" disabled>
                Select Vendor
              </MenuItem>
              <MenuItem value="1">Vendor 1</MenuItem>
              <MenuItem value="2">Vendor 2</MenuItem>
              <MenuItem value="3">Vendor 3</MenuItem>
              {/* Add more MenuItem options as needed */}
            </Select>
            <div style={{ color: 'red' }}>{errors.vendorId?.message}</div>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Invoice Number" name="invoiceNumber" {...register('invoiceNumber')} />
            <div style={{ color: 'red' }}>{errors.invoiceNumber?.message}</div>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Invoice Date"
              type="date"
              name="invoiceDate"
              {...register('invoiceDate')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div style={{ color: 'red' }}>{errors.invoiceDate?.message}</div>
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              label="Inventry Type"
              name="inventryTypeId"
              {...register('inventryTypeId')}
              error={!!errors.inventryTypeId}
              onChange={handleInventryTypeChange}
            >
              <MenuItem value="" disabled>
                Select Inventry Type
              </MenuItem>
              {inventryTypeOptions.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
            <div style={{ color: 'red' }}>{errors.inventryTypeId?.message}</div>
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              label="Inventry Brand"
              name="inventryBrandId"
              {...register('inventryBrandId')}
              error={!!errors.inventryBrandId}
            >
              <MenuItem value="" disabled>
                Select Inventry Brand
              </MenuItem>
              {inventryBrands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>{brand.name}</MenuItem>
              ))}
            </Select>
            <div style={{ color: 'red' }}>{errors.inventryBrandId?.message}</div>
          </Grid>
        </Grid>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedVendor ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditStockSidebar;
