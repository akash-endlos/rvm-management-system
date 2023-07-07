import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  inventory: yup
    .array()
    .of(
      yup.object().shape({
        _inventory: yup.string().required('Inventory ID is required'),
        warrantyStart: yup.date().required('Warranty start date is required'),
        warrantyExpire: yup.date().required('Warranty expiration date is required'),
      })
    )
    .min(1, 'At least one inventory field is required'),
});

const AddEditMachineSidebar = ({ onClose, onSubmit, selectedMachine }) => {
  console.log(selectedMachine);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      inventory: selectedMachine?.inventory || [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventory',
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
        width: '800px',
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
          Machine
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          {fields.map((item, index) => (
            <div key={item.id}>
              <TextField
                fullWidth
                name={`inventory[${index}]._inventory`}
                label="Inventory ID"
                defaultValue={item._inventory}
                {...register(`inventory[${index}]._inventory`)}
              />
              <p style={{ color: 'red' }}>{errors.inventory?.[index]?._inventory?.message}</p>

              <TextField
                fullWidth
                name={`inventory[${index}].warrantyStart`}
                label="Warranty Start"
                type="date"
                defaultValue={item.warrantyStart}
                {...register(`inventory[${index}].warrantyStart`)}
              />
              <p style={{ color: 'red' }}>{errors.inventory?.[index]?.warrantyStart?.message}</p>

              <TextField
                fullWidth
                name={`inventory[${index}].warrantyExpire`}
                label="Warranty Expire"
                type="date"
                defaultValue={item.warrantyExpire}
                {...register(`inventory[${index}].warrantyExpire`)}
              />
              <p style={{ color: 'red' }}>{errors.inventory?.[index]?.warrantyExpire?.message}</p>

              <Button onClick={() => remove(index)}>Remove</Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
          onClick={() => append({})}
        >
          Add
        </Button>
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
