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
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// const schema = yup.object().shape({
//   branchId: yup.string(),
//   inventory: yup
//     .array()
//     .of(
//       yup.object().shape({
//         _inventory: yup.string().required('Inventory is required'),
//         warrantyStart: yup.string().required('Warranty Start is required'),
//         warrantyExpire: yup.string().required('Warranty Expire is required'),
//       })
//     )
//     .required('At least one inventory item is required'),
// });

const schema = yup.object().shape({
  machineId: yup.string().required('Machine ID is required'),
  branchId: yup.string(),
  warrentyStartDate: yup.string().required('Warranty Start Date is required'),
  inventory: yup
    .array()
    .of(
      yup.object().shape({
        _inventory: yup.string().required('Inventory is required'),
        warrantyStart: yup.string().required('Warranty Start is required'),
        warrantyExpire: yup.string().required('Warranty Expire is required'),
      })
    )
    .required('At least one inventory item is required'),
});



const AddEditMachineSidebar = ({ onClose, onSubmit, selectedMachine }) => {
  console.log(selectedMachine);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    defaultValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      machineId: selectedMachine?.machineId || '',
      branchId: selectedMachine?.branchId || '',
      warrentyStartDate: selectedMachine?.warrentyStartDate || '',
      inventory: selectedMachine?.inventory || [],
    },


  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventory',
  });

  const handleFormSubmit = (data) => {
    const modifiedData = {
      ...data,
    };
    console.log(modifiedData);
    onSubmit(modifiedData);
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
          <TextField
            fullWidth
            name="machineId"
            label="Machine ID"
            {...register('machineId')}
            error={!!errors.machineId}
            helperText={errors.machineId?.message}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Branch ID</InputLabel>
          <Select
            fullWidth
            name="branchId"
            {...register('branchId')}
            error={!!errors.branchId}
            renderValue={(selected) => selected || 'Select Branch ID'}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="branch1">Branch 1</MenuItem>
            <MenuItem value="branch2">Branch 2</MenuItem>
            <MenuItem value="branch3">Branch 3</MenuItem>
            {/* Add more branch options as needed */}
          </Select>
          {errors.branchId && (
            <FormHelperText error>{errors.branchId.message}</FormHelperText>
          )}
        </div>
        <div style={{ marginBottom: '10px' }}>
        <InputLabel>Warranty Start Date</InputLabel>
          <TextField
            fullWidth
            type='date'
            name="warrentyStartDate"
            {...register('warrentyStartDate')}
            error={!!errors.warrentyStartDate}
            helperText={errors.warrentyStartDate?.message}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Inventory</InputLabel>
          {fields.map((item, index) => (
            <div key={item.id}>
              <TextField
                fullWidth
                name={`inventory[${index}]._inventory`}
                {...register(`inventory[${index}]._inventory`)}
                label="Inventory"
                defaultValue={item._inventory}
                error={!!errors?.inventory?.[index]?._inventory}
                helperText={errors?.inventory?.[index]?._inventory?.message}
              />
              <TextField
                fullWidth
                type='date'
                name={`inventory[${index}].warrantyStart`}
                {...register(`inventory[${index}].warrantyStart`)}
                label="Warranty Start"
                defaultValue={item.warrantyStart}
                error={!!errors?.inventory?.[index]?.warrantyStart}
                helperText={errors?.inventory?.[index]?.warrantyStart?.message}
              />
              <TextField
                fullWidth
                type='date'
                name={`inventory[${index}].warrantyExpire`}
                {...register(`inventory[${index}].warrantyExpire`)}
                label="Warranty Expire"
                defaultValue={item.warrantyExpire}
                error={!!errors?.inventory?.[index]?.warrantyExpire}
                helperText={errors?.inventory?.[index]?.warrantyExpire?.message}
              />
              <Button onClick={() => remove(index)}>Remove</Button>
            </div>
          ))}
          {errors.inventory && (
            <FormHelperText error>{errors.inventory.message}</FormHelperText>
          )}
          <Button
            onClick={() =>
              append({
                _inventory: '',
                warrantyStart: '',
                warrantyExpire: '',
              })
            }
          >
            Add Inventory
          </Button>
        </div>
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
