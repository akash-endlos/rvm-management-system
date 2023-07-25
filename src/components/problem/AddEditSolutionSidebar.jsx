import React, { useState } from 'react';
import { Button, TextField, InputLabel, Typography } from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  solution: yup.array().of(
    yup.object().shape({
      step: yup.number(),
      description: yup.string().required('Description is required'),
      image: yup.mixed(), // You might want to add validation for the image field as needed
    })
  ),
});

const AddEditSolutionSidebar = ({ onClose, onSubmit, selectedSolution, selectedProblem }) => {
  console.log(selectedSolution);
  const [SelectedImage, setsetSelectedImage] = useState(null);
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
    const transformedData = new FormData();
    data.solution.forEach((solution, index) => {
      console.log(solution.image);
      transformedData.append('problemId', selectedProblem._id);
      transformedData.append(`solution[${index}][step]`, solution.step.toString());
      transformedData.append(`solution[${index}][description]`, solution.description);
      transformedData.append(`solution[${index}][image]`, SelectedImage);

      // Check if there's a new image selected, if not, use the existing image from the selectedSolution
      const image = solution.image instanceof File ? solution.image : selectedSolution?.solution[index]?.image;
      transformedData.append(`solution[${index}][image]`, image);
    });
    onSubmit(transformedData);
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    console.log(file);
    setsetSelectedImage(file);
  };

  const handleCancel = () => {
    setValue('solution', selectedProblem
      ? selectedSolution?.solution.map((solution) => ({ ...solution, image: '' }))
      : [{ step: 1, description: '', image: '' }]);
    onClose();
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
              {/* Display the image preview */}
              {console.log(field)}
              {field.image && typeof field.image !== 'string' && (
                <img
                  src={`https://storage.googleapis.com/rvmoperationadditionalbucket/rvmbackend/${field.image}`}
                  alt={`Solution ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              )}
              {/* Display the existing image from selectedSolution */}
              {typeof field.image === 'string' && (
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
