import React from 'react';
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
  serialNumber: yup.string().required('Serial Number is required'),
});


const AddEditInventoryDetailSidebar = ({ onClose, onSubmit, selectedDetail, brands }) => {
  console.log(selectedDetail);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      invoiceNo: selectedDetail?.invoiceNo || '',
      serialNumber: selectedDetail?.serialNumber || '',
      purchaseDate: selectedDetail?.purchaseDate || undefined,
      warrantyExpired: selectedDetail?.warrantyExpired || undefined,
    },
  });

  const handleFormSubmit = (data) => {
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
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Serial Number <small>eg:- ABC-XYZ-MNP,ZXC-MNB-JHU</small></InputLabel>
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
