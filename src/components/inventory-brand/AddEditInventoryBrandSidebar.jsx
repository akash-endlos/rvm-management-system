import React, { useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Typography,
  FormControl,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllInventoryTypes } from '@/redux/reducers/inventoryTypeSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  inventryTypeId: yup.string().required('Inventory Type is required'),
});

const AddEditInventoryBrand = ({ onClose, onSubmit, selectedInventoryBrand }) => {
  const allinventoryType = useSelector((state) => state.inventory)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllInventoryTypes());
    };

    fetchData();
  }, [dispatch]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedInventoryBrand?.name || '',
      inventryTypeId: selectedInventoryBrand?.inventryTypeId || '',
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
          Inventory Brand
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
          <FormControl fullWidth>
            <InputLabel id="inventryTypeId-label">Inventory Type</InputLabel>
            <Select
              labelId="inventryTypeId-label"
              id="inventryTypeId"
              name="inventryTypeId"
              {...register('inventryTypeId')}
              error={!!errors.inventryTypeId}
              defaultValue={selectedInventoryBrand?.inventryTypeId || ''}
            >
              {allinventoryType && allinventoryType.map((item,index)=>(
              <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
            {errors.inventryTypeId && (
              <FormHelperText>{errors.inventryTypeId.message}</FormHelperText>
            )}
          </FormControl>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedInventoryBrand ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditInventoryBrand;
