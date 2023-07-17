import { Button, Typography, TextField, Box, FormControl, Select, MenuItem, FormLabel } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  machineId: yup.string().required('Machine ID is required'),
});

const AddEditMachineSidebar = ({
  onClose,
  onSubmit,
  selectedMachine,
  branches,
  assignedInventories,
  unassignedInventories,
  vendors,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchResellerId = watch('resellerId');
  const watchCustomerId = watch('customerId');
  const watchBranchId = watch('branchId');
  const onFormSubmit = (data) => {
    console.log(data);
    onSubmit(data);
  };
  const customers = vendors.find((vendor) => vendor._id === watchResellerId)?.customers || [];
  const branch = customers.flatMap((customer) => customer.branches) || [];
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '800px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
        overflowY: 'auto',
      }}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
          Machine Inventory
        </Typography>
        <TextField
          fullWidth
          label="Machine ID"
          variant="outlined"
          name="machineId"
          {...register('machineId')}
          error={!!errors.machineId}
          helperText={errors.machineId?.message}
          style={{ marginBottom: '1rem' }}
        />
        <FormControl sx={{ width: '100%' }}>
          <FormLabel>Reseller</FormLabel>
          <Select id="resellerId" name="resellerId" {...register('resellerId')}>
            <MenuItem value="">Select a reseller</MenuItem>
            {vendors.map((item, index) => (
              <MenuItem value={item._id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>


        {watchResellerId && (
          <FormControl sx={{ width: '100%' }}>
            <FormLabel>Customer</FormLabel>
            <Select id="customerId" name="customerId" {...register('customerId')}>
              <MenuItem value="">Select a customer</MenuItem>
              {customers.map((item, index) => (
                <MenuItem value={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {watchCustomerId && (
          <FormControl sx={{ width: '100%' }}>
            <FormLabel>Branch</FormLabel>
            <Select id="branchId" name="branchId" {...register('branchId')}>
              <MenuItem value="">Select a branch</MenuItem>
              {branch.map((item, index) => (
                <MenuItem value={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Box>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ marginRight: '10px' }}
          >
            {selectedMachine ? 'Update' : 'Submit'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </form>
    </div>
  );
};

export default AddEditMachineSidebar;
