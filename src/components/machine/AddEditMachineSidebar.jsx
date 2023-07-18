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



const AddEditMachineSidebar = ({ onClose, onSubmit, selectedMachine, branches, unassignedInventories }) => {

  const { handleSubmit,
    register,
    control,
    formState: { errors },
    defaultValues,
    watch,
    setValue,
    reset } = useForm()
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
        overflowY: 'auto',
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
          Machine Inventory
        </Typography>
        




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
