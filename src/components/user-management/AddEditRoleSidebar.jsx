import React from 'react';
import {
  Button,
  TextField,
  InputLabel,
  FormHelperText,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  roleName: yup.string().required('Role name is required'),
  description: yup.string().required('Description is required'),
});

const AddEditRoleSidebar = ({ onClose, onSubmit, selectedRole }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roleName: selectedRole?.roleName || '',
      description: selectedRole?.description || '',
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
          Role
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Role Name</InputLabel>
          <TextField fullWidth name="roleName" {...register('roleName')} />
          <FormHelperText>{errors.roleName?.message}</FormHelperText>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Description</InputLabel>
          <TextField
            fullWidth
            name="description"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedRole ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditRoleSidebar;
