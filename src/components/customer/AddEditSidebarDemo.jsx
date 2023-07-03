import { Button, TextField } from "@mui/material";
import { useState } from "react";

const AddEditSidebar = ({ columns, initialValues, onClose, onSubmit }) => {
  const [formValues, setFormValues] = useState(initialValues || {});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
      }}
    >
      <form onSubmit={handleSubmit}>
        {columns
          .filter((column) => !column.hideInAdd && !column.hideInEdit)
          .map((column) => (
            <div key={column.accessorKey} style={{ marginBottom: '10px' }}>
              <TextField
                fullWidth
                name={column.accessorKey}
                label={column.header}
                value={formValues[column.accessorKey] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          Submit
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditSidebar