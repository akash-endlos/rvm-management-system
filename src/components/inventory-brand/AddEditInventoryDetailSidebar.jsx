import React, { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  invoiceNo: yup.string().required('Invoice No is required'),
  brandName: yup.string().when('brandSelection', (brandSelection, schema) => {
    if (brandSelection === 'newBrand') {
      return schema.required('Brand Name is required');
    }
    return schema;
  }),
  brandId: yup.string().when('brandSelection', (brandSelection, schema) => {
    if (brandSelection === 'existingBrand') {
      return schema.required('Brand ID is required');
    }
    return schema;
  }),
  serialNumber: yup.string().required('Serial Number is required'),
});


const AddEditInventoryDetailSidebar = ({ onClose, onSubmit, selectedDetail,brands }) => {
  const [brandSelection, setBrandSelection] = useState('existingBrand'); 

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invoiceNo: selectedDetail?.invoiceNo || '',
      brandSelection,
      brandName: selectedDetail?.brandName || '',
      brandId: selectedDetail?.brandId || '',
      serialNumber: selectedDetail?.serialNumber || '',
      purchaseDate: selectedDetail?.purchaseDate || undefined,
      warrantyExpired: selectedDetail?.warrantyExpired || undefined,
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleBrandSelectionChange = (event) => {
    setBrandSelection(event.target.value);
  };

  const brandOptions = [
    { value: 'brand1', label: 'Brand 1' },
    { value: 'brand2', label: 'Brand 2' },
    { value: 'brand3', label: 'Brand 3' },
    // Add more brand options as needed
  ];

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
          Detail
        </Typography>

        <div style={{ marginBottom: '10px' }}>
          <RadioGroup name="brandSelection" value={brandSelection} onChange={handleBrandSelectionChange}>
            <FormControlLabel value="existingBrand" control={<Radio />} label="Existing Brand" />
            <FormControlLabel value="newBrand" control={<Radio />} label="New Brand" />
          </RadioGroup>
        </div>

        {brandSelection === 'existingBrand' ? (
          <div style={{ marginBottom: '10px' }}>
            <InputLabel>Brand ID</InputLabel>
            <Select
              fullWidth
              name="brandId"
              {...register('brandId')}
              error={!!errors.brandId}
              renderValue={(selected) => {
                const brandOption = brands.find((option) => option._id === selected);
                return brandOption ? brandOption.name : '';
              }}
            >
              {brands.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
            {errors.brandId && (
              <FormHelperText error>{errors.brandId.message}</FormHelperText>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: '10px' }}>
            <InputLabel>Brand Name</InputLabel>
            <TextField
              fullWidth
              name="brandName"
              {...register('brandName')}
              error={!!errors.brandName}
              helperText={errors.brandName?.message}
            />
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Invoice No</InputLabel>
          <TextField
            fullWidth
            name="invoiceNo"
            {...register('invoiceNo')}
            error={!!errors.invoiceNo}
            helperText={errors.invoiceNo?.message}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Serial Number</InputLabel>
          <TextField
            fullWidth
            name="serialNumber"
            {...register('serialNumber')}
            error={!!errors.serialNumber}
            helperText={errors.serialNumber?.message}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Purchase Date</InputLabel>
          <TextField
            fullWidth
            name="purchaseDate"
            type="date"
            {...register('purchaseDate')}
            // error={!!errors.purchaseDate}
            // helperText={errors.purchaseDate?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Warranty Expired</InputLabel>
          <TextField
            fullWidth
            name="warrantyExpired"
            type="date"
            {...register('warrantyExpired')}
            // error={!!errors.warrantyExpired}
            // helperText={errors.warrantyExpired?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedDetail ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditInventoryDetailSidebar;
