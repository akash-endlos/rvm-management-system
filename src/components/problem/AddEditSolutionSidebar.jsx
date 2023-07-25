import React from 'react';
import { Button, TextField, InputLabel, Typography } from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  solutions: yup.array().of(
    yup.object().shape({
      step: yup.number(),
      description: yup.string().required('Description is required'),
      image: yup.string(), // You might want to add validation for the image field as needed
    })
  ),
});

const AddEditSolutionSidebar = ({ onClose, onSubmit, selectedSolution, selectedProblem }) => {
  console.log(selectedSolution);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      solutions: selectedSolution
        ? selectedSolution?.solution.map((solution) => ({ ...solution, image: '' }))
        : [{ step: 1, description: '', image: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'solutions',
  });

  const handleFormSubmit = (data) => {
    const transformedData = new FormData()
    data.solutions.forEach((solution, index) => {
        transformedData.append('problemId', selectedProblem._id);
        transformedData.append(`solution[${index}][step]`, solution.step.toString());
        transformedData.append(`solution[${index}][description]`, solution.description);
        transformedData.append(`solution[${index}][image]`, solution.image);
      });
    onSubmit(transformedData);
  };
  

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      // Set up a Promise to handle the asynchronous reading of the file
      const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };
  
      try {
        // Read the file and get the binary data (data URL)
        const imageData = await readFileAsync(file);
  
        // Set the binary data (data URL) to the corresponding field in the form
        setValue(`solutions[${index}].image`, imageData);
      } catch (error) {
        console.error('Error reading image file:', error);
      }
    }
  };
  

  const handleCancel = () => {
    setValue('solutions', selectedProblem
      ? selectedProblem?.solutions.map((solution) => ({ ...solution, image: '' }))
      : [{ step: 1, description: '', image: '' }]);
      onClose()
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

        {fields.map((field, index) => (
          <div key={field.id}>
            <Typography variant="h6" style={{ fontWeight: 'bold', color: 'teal' }}>
              Solution {index + 1}
            </Typography>
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>SR Number</InputLabel>
              <TextField
                fullWidth
                name={`solutions[${index}].step`}
                value={index + 1}
                disabled
                {...register(`solutions[${index}].step`)}
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
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>Attach Image</InputLabel>
              <input
                type="file"
                name={`solutions[${index}].image`}
                onChange={(e) => handleImageChange(e, index)}
              />
              {/* Display the image if the URL is available */}
              {field.image && (
                <img
                  src={field.image}
                  alt={`Solution ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              )}
            </div>
            <Button onClick={() => remove(index)}>Remove Solution</Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() => append({ step: fields.length + 1, description: '', image: '' })}
        >
          Add Solution
        </Button>

        <Button type="submit" color="primary" variant="contained" style={{ marginRight: '10px' }}>
          {selectedSolution ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditSolutionSidebar;
