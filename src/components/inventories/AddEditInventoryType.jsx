import React, { useEffect } from 'react';
import {
  Button,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVendors } from '@/redux/reducers/vendorSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

const AddEditInventoryType = ({ onClose, onSubmit, selectedInventoryType }) => {
  const vendors = useSelector((state) => state?.vendor?.vendors)
  console.log(vendors);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllVendors())
  }, [])
  console.log(selectedInventoryType?.vendorId);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedInventoryType?.name || '',
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
          Inventory Type
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          <TextField fullWidth name="name" {...register('name')} />
          <FormHelperText>{errors.name?.message}</FormHelperText>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedInventoryType ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditInventoryType;
