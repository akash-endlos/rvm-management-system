import React, { useState } from 'react';
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

const schema = yup.object().shape({
  name: yup.string().required('Branch Name is required'),
  solutions: yup.array().of(
    yup.object().shape({
      srNumber: yup.number(),
      description: yup.string().required('Description is required'),
      image: yup.string(), // You might want to add validation for the image field as needed
    })
  ),
});

const AddEditSolutionSidebar = ({ onClose, onSubmit, selectedSolution, selectedProblem }) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedProblem ? selectedProblem?.name : '',
      solutions: selectedProblem ? selectedProblem?.solutions : [{ srNumber: 1, description: '', image: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'solutions',
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
          Solution
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          <InputLabel>Name</InputLabel>
          <TextField
            fullWidth
            name="name"
            disabled
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </div>

        {fields.map((field, index) => (
          <div key={field.id}>
            <Typography variant="h6" style={{ fontWeight: 'bold', color: 'teal' }}>
              Solution {index + 1}
            </Typography>
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>SR Number</InputLabel>
              <TextField
                fullWidth
                name={`solutions[${index}].srNumber`}
                value={index + 1}
                disabled
                {...register(`solutions[${index}].srNumber`)}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>Description</InputLabel>
              <TextField
                fullWidth
                name={`solutions[${index}].description`}
                {...register(`solutions[${index}].description`)}
                error={!!errors?.solutions?.[index]?.description}
                helperText={errors?.solutions?.[index]?.description?.message}
              />
            </div>
            {/* Add file input for image attachment */}
            {/* You can customize this as needed */}
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>Attach Image</InputLabel>
              <input
                type="file"
                name={`solutions[${index}].image`}
                {...register(`solutions[${index}].image`)}
              />
            </div>
            <Button onClick={() => remove(index)}>Remove Solution</Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() => append({ srNumber: fields.length + 1, description: '', image: '' })}
        >
          Add Solution
        </Button>

        <Button type="submit" color="primary" variant="contained" style={{ marginRight: '10px' }}>
          {selectedSolution ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditSolutionSidebar;
