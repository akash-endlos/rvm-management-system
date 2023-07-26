import React, { useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { fetchAllVendors } from '@/redux/reducers/vendorSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  contact: yup.string().required('Contact is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const AddEditLocalVendorSidebar = ({ onClose, onSubmit, selectedVendor }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllVendors());
  }, []);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedVendor?.name || '',
      contact: selectedVendor?.contact || '',
      email: selectedVendor?.email || '',
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
          Vendor
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          <TextField fullWidth label="Name" name="name" {...register('name')} />
          <div style={{ color: 'red' }}>{errors.name?.message}</div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <TextField fullWidth label="Contact" name="contact" {...register('contact')} />
          <div style={{ color: 'red' }}>{errors.contact?.message}</div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <TextField fullWidth label="Email" name="email" {...register('email')} />
          <div style={{ color: 'red' }}>{errors.email?.message}</div>
        </div>
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

export default AddEditLocalVendorSidebar;
