import React from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  password: yup.string().required('Password is required'),
  mobile: yup.string().required('Mobile is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const AddEditUserSidebar = ({ onClose, onSubmit, selectedUser }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedUser?.name || '',
      password: selectedUser?.password || '',
      mobile: selectedUser?.mobile || '',
      email: selectedUser?.email || '',
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
          User
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Name</InputLabel>
          <TextField
            fullWidth
            name="name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Password</InputLabel>
          <TextField
            fullWidth
            name="password"
            {...register('password')}
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Mobile</InputLabel>
          <TextField
            fullWidth
            name="mobile"
            {...register('mobile')}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Email</InputLabel>
          <TextField
            fullWidth
            name="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedUser ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditUserSidebar;
