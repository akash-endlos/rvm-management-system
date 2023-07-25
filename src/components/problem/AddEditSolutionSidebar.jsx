import React from 'react';
import { Button, TextField, InputLabel, Typography } from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  solution: yup.array().of(
    yup.object().shape({
      step: yup.number(),
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
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      solution: selectedSolution
        ? selectedSolution?.solution.map((solution) => ({ ...solution, image: '' }))
        : [{ step: 1, description: '', image: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'solution',
  });

  const handleFormSubmit = (data) => {
    // Transform the data into the desired format for the API request
    const transformedData = new FormData();
    transformedData.append('problemId', selectedProblem._id);
    data.solution.forEach((solution, index) => {
      transformedData.append(`solution[${index}][step]`, solution.step.toString());
      transformedData.append(`solution[${index}][description]`, solution.description);
      transformedData.append(`solution[${index}][image]`, solution.image);
    });

    console.log('Transformed Data:', transformedData);

    // Call the onSubmit function to pass the transformed data to the parent component
    onSubmit(transformedData);
  };

//   const handleImageChange = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       setValue(`solution[${index}].image`, file);
//     }
//   };


const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // 'result' will contain the buffer data of the selected file
        const buffer = reader.result;
        setValue(`solution[${index}].image`, buffer);
        console.log(file);
        console.log('File Name:', file.name);
        console.log('File Size:', file.size);
        console.log('File Type:', file.type);
        console.log('File Buffer Data:', buffer); // Here's the buffer data
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleCancel = () => {
    setValue('solution', selectedProblem
      ? selectedProblem?.solution.map((solution) => ({ ...solution, image: '' }))
      : [{ step: 1, description: '', image: '' }]);
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
                name={`solution[${index}].step`}
                value={index + 1}
                disabled
                {...register(`solution[${index}].step`)}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>Description</InputLabel>
              <TextField
                fullWidth
                name={`solution[${index}].description`}
                {...register(`solution[${index}].description`)}
                error={!!errors?.solution?.[index]?.description}
                helperText={errors?.solution?.[index]?.description?.message}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <InputLabel>Attach Image</InputLabel>
              <input
                type="file"
                name={`solution[${index}].image`}
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
