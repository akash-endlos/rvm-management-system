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
  FormControlLabel,
  Radio
} from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import moment from 'moment';

const AddEditMachineSidebar = ({ onClose, onSubmit, selectedMachine, branches, unassignedInventories }) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      inventoryDetails: selectedMachine ? selectedMachine.inventoryDetails : []
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventoryDetails'
  });

  const handleFormSubmit = (data) => {
    console.log(data);
    onSubmit(data);
    reset();
  };

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
        overflowY: 'auto'
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
          Machine Inventory
        </Typography>

        {fields.map((detail, index) => (
          <div key={detail.id}>
            <Controller
              name={`inventoryDetails.${index}.type`}
              control={control}
              defaultValue={detail.type}
              render={({ field }) => (
                <Select {...field} label="Type">
                  <MenuItem value="Type 1">Type 1</MenuItem>
                  <MenuItem value="Type 2">Type 2</MenuItem>
                  <MenuItem value="Type 3">Type 3</MenuItem>
                </Select>
              )}
            />

            <Controller
              name={`inventoryDetails.${index}.brand`}
              control={control}
              defaultValue={detail.brand}
              render={({ field }) => (
                <Select {...field} label="Brand">
                  <MenuItem value="Brand 1">Brand 1</MenuItem>
                  <MenuItem value="Brand 2">Brand 2</MenuItem>
                  <MenuItem value="Brand 3">Brand 3</MenuItem>
                </Select>
              )}
            />

            <Controller
              name={`inventoryDetails.${index}.inventory`}
              control={control}
              defaultValue={detail.inventory}
              render={({ field }) => (
                <Select {...field} label="Inventory">
                  <MenuItem value="Inventory 1">Inventory 1</MenuItem>
                  <MenuItem value="Inventory 2">Inventory 2</MenuItem>
                  <MenuItem value="Inventory 3">Inventory 3</MenuItem>
                </Select>
              )}
            />

            <Controller
              name={`inventoryDetails.${index}._id`}
              control={control}
              defaultValue={detail._id}
              render={({ field }) => <TextField {...field} label="ID" />}
            />

            <Controller
              name={`inventoryDetails.${index}.resellerWarrantyStart`}
              control={control}
              defaultValue={detail.resellerWarrantyStart}
              render={({ field }) => (
                <TextField {...field} label="Reseller Warranty Start" />
              )}
            />

            <Controller
              name={`inventoryDetails.${index}.resellerWarrantyExpire`}
              control={control}
              defaultValue={detail.resellerWarrantyExpire}
              render={({ field }) => (
                <TextField {...field} label="Reseller Warranty Expire" />
              )}
            />

            {index === fields.length - 1 && (
              <Button variant="outlined" onClick={() => append({})}>
                Add More Details
              </Button>
            )}

            {index !== fields.length - 1 && (
              <Button variant="outlined" onClick={() => remove(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}

        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedMachine ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditMachineSidebar;
