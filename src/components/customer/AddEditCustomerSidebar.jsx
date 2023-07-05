import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVendors } from '@/redux/reducers/vendorSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  vendorId: yup.string().required('Vendor ID is required'),
  branchName: yup.string().optional(),
});

const AddEditCustomerSidebar = ({ onClose, onSubmit, selectedCustomer }) => {
  const vendors = useSelector((state) => state?.vendor?.vendors)
  console.log(vendors);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAllVendors())
  }, [])
  console.log(selectedCustomer?.vendorId);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedCustomer?.name || '',
      vendorId: selectedCustomer?.vendorId || '',
      branchName: selectedCustomer?.branchName || '',
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
              Customer
            </Typography>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Name</InputLabel>
          <TextField fullWidth name="name" {...register('name')} />
          <FormHelperText>{errors.name?.message}</FormHelperText>
        </div>
       {!selectedCustomer && <div style={{ marginBottom: '10px' }}>
          <InputLabel id="vendorId-label">Vendor ID</InputLabel>
          <Select
            fullWidth
            labelId="vendorId-label"
            name="vendorId"
            {...register('vendorId', { required: true })}
            defaultValue={selectedCustomer?.vendorId || ''}
          >
            {vendors?.length>0 && vendors?.map((item, index) => (
              <MenuItem key={index} value={item?._id}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>{errors.vendorId?.message}</FormHelperText>
        </div>}
        {!selectedCustomer && <div style={{ marginBottom: '10px' }}>
          <InputLabel>Branch Name (Optional)</InputLabel>
          <TextField
            fullWidth
            name="branchName"
            {...register('branchName')}
            error={!!errors.branchName}
            helperText={errors.branchName?.message}
          />
        </div>}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedCustomer ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditCustomerSidebar;
