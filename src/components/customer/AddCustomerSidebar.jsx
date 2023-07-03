import React from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  vendorId: yup.string().required("Vendor ID is required"),
  branchName: yup.string().optional(),
});

const AddCustomerSidebar = ({ onClose, onSubmit }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", vendorId: "", branchName: "" },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        zIndex: 999,
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div style={{ marginBottom: "10px" }}>
          <InputLabel >Name</InputLabel>
          <TextField
            fullWidth
            name="name"
            {...register("name")}
          />
           <FormHelperText>{errors.name?.message}</FormHelperText>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <InputLabel id="vendorId-label">Vendor ID</InputLabel>
          <Select
            fullWidth
            labelId="vendorId-label"
            name="vendorId"
            {...register("vendorId", { required: true })}
            // error={!!errors.vendorId}
            // helperText={errors.vendorId?.message}
            defaultValue=""
          >
            <MenuItem value="">Select Vendor ID</MenuItem>
            <MenuItem value="vendor1">Vendor 1</MenuItem>
            <MenuItem value="vendor2">Vendor 2</MenuItem>
            <MenuItem value="vendor3">Vendor 3</MenuItem>
          </Select>
          <FormHelperText>{errors.vendorId?.message}</FormHelperText>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <InputLabel >Branch Name (Optional)</InputLabel>
          <TextField
            fullWidth
            name="branchName"
            {...register("branchName")}
            error={!!errors.branchName}
            helperText={errors.branchName?.message}
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: "10px" }}
        >
          Submit
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddCustomerSidebar;
