import React, { useEffect } from 'react';
import { Button, TextField, Typography, Select, MenuItem, FormLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllInventoryTypes } from '@/redux/reducers/inventoryTypeSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().optional(),
  category: yup.string().required('Category is required'),
  problemType:  yup.string().when("category", {
    is: 'Hardware',
    then: () => yup.string().required('Problem Type is required')
  })
});

const AddEditProblemSidebar = ({ onClose, onSubmit, selectedProblem }) => {
  const problemtype=useSelector((state)=>state.inventoryType)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchAllInventoryTypes()).unwrap()
        .then(() => {
          // Success
        })
        .catch(error => {
          toast.error(error);
        });
    };

    fetchData();
  }, [dispatch]);
  
  console.log(selectedProblem);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: selectedProblem?.name || '',
      description: selectedProblem?.description || '',
      category: selectedProblem?.category || '',
      problemType: selectedProblem?.category === 'Hardware' ? '' : undefined,
    },
  });
console.log(watch('category'));
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
          Problem
        </Typography>
        <div style={{ marginBottom: '10px' }}>
          <FormLabel variant="body1" >Category</FormLabel>
          <Select
            fullWidth
            name="category"
            {...register('category')}
            value={watch('category')}
          >
            <MenuItem value="Hardware">Hardware</MenuItem>
            <MenuItem value="Plc">PLC</MenuItem>
            <MenuItem value="Software">Software</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <Typography variant="body2" color="error">{errors.category?.message}</Typography>
        </div>
        {watch('category') === 'Hardware' && (
          <div style={{ marginBottom: '10px' }}>
            <FormLabel variant="body1">Problem Type</FormLabel>
            <Select fullWidth name="problemType" {...register('problemType')}>
              {problemtype && problemtype.map((item,index)=>(
              <MenuItem key={index} value={item._id}>{item.name}</MenuItem>
              ))}
              {/* <MenuItem value="Type 2">Type 2</MenuItem>
              <MenuItem value="Type 3">Type 3</MenuItem> */}
            </Select>
            <Typography variant="body2" color="error">{errors.problemType?.message}</Typography>
          </div>)
        }
        <div style={{ marginBottom: '10px' }}>
          <FormLabel variant="body1" >Name</FormLabel>
          <TextField fullWidth name="name" {...register('name')} />
          <Typography variant="body2" color="error">{errors.name?.message}</Typography>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <FormLabel variant="body1" >Description</FormLabel>
          <TextField fullWidth name="description" {...register('description')} />
          <Typography variant="body2" color="error">{errors.description?.message}</Typography>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedProblem ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditProblemSidebar;