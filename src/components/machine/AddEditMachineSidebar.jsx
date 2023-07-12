import React, { useEffect, useState } from 'react';
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

const schema = yup.object().shape({
  machineId: yup.string().required('Machine ID is required'),
  branchId: yup.string(),
  warrentyStart: yup.string().required('Warranty Start Date is required'),
  warrentyExpire: yup.string().required('Warranty Expire Date is required'),
  inventry: yup
    .array()
    .of(
      yup.object().shape({
        _inventry: yup.string().required('Inventory is required'),
        warrantyStart: yup.string().required('Warranty Start is required'),
        warrantyExpire: yup.string().required('Warranty Expire is required'),
      })
    )
    .required('At least one inventory item is required'),
});

const AddEditMachineSidebar = ({ onClose, onSubmit, selectedMachine, branches, assignedInventories,unassignedInventories }) => {
  const [editInventory, setEditInventory] = useState(false)
  const [inventories, setInventories] = useState([])
 useEffect(() => {
  if(editInventory)
  {
    setInventories(unassignedInventories)
  }
  else{
    setInventories(assignedInventories)
  }
 }, [editInventory])
 
  const durationOptions = [
    { value: '6', label: '6 months' },
    { value: '12', label: '12 months' },
    { value: 'custom', label: 'Custom' },
  ];
  const [selectedDuration, setSelectedDuration] = useState('');
  const [customDuration, setCustomDuration] = useState('');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    defaultValues,
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      machineId: selectedMachine?.machineId || '',
      branchId: selectedMachine?.branch?._id || '',
      warrentyStart: selectedMachine ? moment(selectedMachine?.warrentyStart).format('YYYY-MM-DD') : '',
      warrentyExpire: selectedMachine ? moment(selectedMachine?.warrentyExpire).format('YYYY-MM-DD') : '',
      inventry: selectedMachine?.inventoryDetails || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventry',
  });


  // const handleDurationChange = (event) => {
  //   const value = event.target.value;
  
  //   setSelectedDuration(value);
  
  //   if (value !== 'custom') {

  //     const warrentyStart = watch('warrentyStart');
  //     console.log(warrentyStart);
  //     const formattedStartDate = moment(warrentyStart, 'YYYY-MM-DD');
  //     const newExpiryDate = formattedStartDate.add(Number(selectedDuration), 'months');
  //     setValue('warrentyExpire', newExpiryDate.format('YYYY-MM-DD'));
  //     setCustomDuration('');
  //   } 
  // };
  
  // const handleCustomDurationChange = (event) => {
  //   const value = event.target.value;
  //   setCustomDuration(value);
  
  //   if (selectedDuration === 'custom') {
  //     const warrentyStart = watch('warrentyStart');
  //     const formattedStartDate = moment(warrentyStart, 'YYYY-MM-DD');
  //     const newExpiryDate = formattedStartDate.add(value, 'months');
  //     setValue('warrentyExpire', newExpiryDate.format('YYYY-MM-DD'));
  //   }
  // };
  const handleDurationChange = (event) => {
    const value = event.target.value;
    setSelectedDuration(value);
    
    if (value !== 'custom') {
      const warrantyStart = watch('warrentyStart');
      const formattedStartDate = moment(warrantyStart, 'YYYY-MM-DD');
      const newExpiryDate = formattedStartDate.add(Number(value), 'months');
      setValue('warrentyExpire', newExpiryDate.format('YYYY-MM-DD'));
      setCustomDuration('');
    }
  };
  
  const handleCustomDurationChange = (event) => {
    const value = event.target.value;
    setCustomDuration(value);
    
    if (selectedDuration === 'custom') {
      const warrantyStart = watch('warrentyStart');
      const formattedStartDate = moment(warrantyStart, 'YYYY-MM-DD');
      const newExpiryDate = formattedStartDate.add(Number(value), 'months');
      setValue('warrentyExpire', newExpiryDate.format('YYYY-MM-DD'));
    }
  };
  const handleFormSubmit = (data) => {
    const modifiedData = {
      ...data,
    };
    console.log(modifiedData);
    onSubmit(modifiedData);
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
        overflowY: 'auto',
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
          Machine Inventory
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

        <FormControl fullWidth error={!!errors.branchId}>
          <Controller
            name="branchId"
            control={control}
            defaultValue={selectedMachine?.branch?._id || ''}
            rules={{ required: 'Branch ID is required' }}
            render={({ field }) => (
              <Select {...field} displayEmpty>
                <MenuItem value="" disabled>
                  Select Branch ID
                </MenuItem>
                {branches?.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.branchId && (
            <FormHelperText error>{errors.branchId.message}</FormHelperText>
          )}
        </FormControl>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Warranty Start Date</InputLabel>
          <TextField
            fullWidth
            type="date"
            name="warrentyStart"
            {...register('warrentyStart')}
            error={!!errors.warrentyStart}
            helperText={errors.warrentyStart?.message}
          />
        </div>
        {durationOptions.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Radio
              value={option.value}
              checked={selectedDuration === option.value}
              onChange={handleDurationChange}
            />
          }
          label={option.label}
        />
      ))}
      {selectedDuration === 'custom' && (
        <TextField
          label="Custom Duration"
          name="customDuration"
          value={customDuration}
          onChange={handleCustomDurationChange}
          fullWidth
        />
      )}
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Warranty Expire Date</InputLabel>
          <TextField
            fullWidth
            type="date"
            name="warrentyExpire"
            {...register('warrentyExpire')}
            error={!!errors.warrentyExpire}
            helperText={errors.warrentyExpire?.message}
          />
        </div>
        <div style={{ marginBottom: '10px' }} >
          <InputLabel>Inventry</InputLabel>
          {fields.map((item, index) => {
            return (
              <div key={item.id} className='flex'>
                <Controller
                  name={`inventry[${index}]._id`}
                  control={control}
                  defaultValue={selectedMachine ? selectedMachine?.inventoryDetails[index]?._id : ''}
                  rules={{ required: 'Inventory is required' }}
                  render={({ field }) => (
                    <Select {...field} fullWidth disabled={selectedMachine?.inventoryDetails[index]?._id}>
                      <MenuItem value="" disabled>
                        Select Inventory
                      </MenuItem>
                      {inventories?.map((inventory) => {
                        return (
                          <MenuItem
                            key={inventory._id}
                            value={inventory._id}
                          >
                            {inventory.serialNumber}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  )}
                />
                {selectedMachine && <TextField
                  fullWidth
                  type="date"
                  name={`inventry[${index}].warrantyStart`}
                  {...register(`inventry[${index}].warrantyStart`)}
                  defaultValue={selectedMachine ? moment(selectedMachine?.inventoryDetails[index]?.resellerWarrantyExpire).format('YYYY-MM-DD') : ''}
                  error={!!errors?.inventry?.[index]?.warrantyStart}
                  helperText={errors?.inventry?.[index]?.warrantyStart?.message}
                />}
                
                {selectedMachine && <TextField
                  fullWidth
                  type="date"
                  name={`inventry[${index}].warrantyExpire`}
                  {...register(`inventry[${index}].warrantyExpire`)}
                  defaultValue={selectedMachine ? moment(selectedMachine?.inventoryDetails[index]?.resellerWarrantyExpire).format('YYYY-MM-DD') : ''}
                  error={!!errors?.inventry?.[index]?.warrantyExpire}
                  helperText={errors?.inventry?.[index]?.warrantyExpire?.message}
                />}
                <Button onClick={() => remove(index)}>Remove</Button>
              </div>
            );
          })}
          {errors.inventry && (
            <FormHelperText error>{errors.inventry.message}</FormHelperText>
          )}
          <Button 
            onClick={() =>
              {append({
                _inventry: '',
                warrantyStart: '',
                warrantyExpire: '',
              });setEditInventory(true)}
            }
          >
            Add Inventry
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
