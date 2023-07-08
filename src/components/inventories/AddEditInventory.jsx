import React from 'react';
import { useState } from 'react';
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
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  invoiceNo: yup.string().required('Invoice No is required'),
  // serialNumber: yup.string().required('SerialNumber No is required'),
  // serialNumbers: yup.array().of(yup.string()).required('Serial Numbers are required'),
});

const AddEditInventorySidebar = ({ onClose, onSubmit, selectedInventory, brands }) => {
  console.log(selectedInventory);

  const [serialNumbers, setSerialNumbers] = useState(selectedInventory?.serialNumbers || []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invoiceNo: selectedInventory?.invoiceNo || '',
      serialNumbers: selectedInventory?.serialNumber || [],
      serialNumber:selectedInventory?.serialNumber,
      purchaseDate: selectedInventory?.purchaseDate || undefined,
      warrantyExpired: selectedInventory?.warrantyExpired || undefined,
    },
  });

  const handleFormSubmit = (data) => {
    console.log(data);
    onSubmit({ ...data, serialNumbers });
  };

  const handleAddSerialNumber = () => {
    const newSerialNumber = document.getElementById('newSerialNumber').value;
    setSerialNumbers([...serialNumbers, newSerialNumber]);
    document.getElementById('newSerialNumber').value = '';
  };

  const handleRemoveSerialNumber = (index) => {
    const updatedSerialNumbers = [...serialNumbers];
    updatedSerialNumbers.splice(index, 1);
    setSerialNumbers(updatedSerialNumbers);
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
          Detail
        </Typography>

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

        {!selectedInventory && <div style={{ marginBottom: '10px' }}>
          <InputLabel>Serial Numbers</InputLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {serialNumbers.map((serialNumber, index) => (
              <Chip
                key={index}
                label={serialNumber}
                onDelete={() => handleRemoveSerialNumber(index)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TextField
              fullWidth
              id="newSerialNumber"
              placeholder="Enter a new serial number"
            />
            <Button variant="outlined" color="primary" onClick={handleAddSerialNumber}>
              Add
            </Button>
          </div>
        </div>}
        {selectedInventory && <div style={{ marginBottom: '10px' }}>
          <InputLabel>Invoice No</InputLabel>
          <TextField
            fullWidth
            name="serialNumber"
            {...register('serialNumber')}
            error={!!errors.serialNumber}
            helperText={errors.serialNumber?.message}
          />
        </div>}
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Purchase Date</InputLabel>
          <TextField
            fullWidth
            name="purchaseDate"
            type="date"
            {...register('purchaseDate')}
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
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>

        <Button type="submit" color="primary" variant="contained" style={{ marginRight: '10px' }}>
          {selectedInventory ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditInventorySidebar;
