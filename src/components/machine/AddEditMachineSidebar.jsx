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
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getInventoryBrandById } from '@/redux/reducers/inventoryBrandSlice';

// Validation schema using yup
const validationSchema = yup.object().shape({
  machineId: yup.string().required('Machine ID is required'),
  resellerId: yup.string().required('Reseller ID is required'),
  branchId: yup.string().notRequired(),
  customerId: yup.string().notRequired(),
  warrentyStart: yup.date().required('Warranty start date is required'),
  warrentyExpire: yup.date().required('Warranty expire date is required'),
  inventoryDetails: yup.array().of(
    yup.object().shape({
      type: yup.string().required('Type is required'),
      brand: yup.string().required('Brand is required'),
      _id: yup.string().required('_id is required'),
      resellerWarrantyStart: yup.date().required('Reseller warranty start date is required'),
      resellerWarrantyExpire: yup.date().required('Reseller warranty expire date is required'),
    })
  ),
});

const AddEditMachineSidebar = ({ onClose, onSubmit, selectedMachine, branches, unassignedInventories }) => {
  // State to hold the dropdown options
  const [typeOptions, setTypeOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [idOptions, setIdOptions] = useState([]);
  const dispatch = useDispatch()


  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    register,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: selectedMachine || {}, 
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventoryDetails',
  });
console.log(selectedMachine);
useEffect(() => {
  if (selectedMachine) {
    // Set default values for the form fields using setValue
    setValue('machineId', selectedMachine.machineId || '');
    setValue('resellerId', selectedMachine.reseller?._id || '');
    setValue('branchId', selectedMachine.branch?._id || '');
    setValue('customerId', selectedMachine.customer?._id || '');
    setValue('warrentyStart', moment(selectedMachine.warrentyStart).format('YYYY-MM-DD') || moment().format());
    setValue('warrentyExpire', moment(selectedMachine.warrentyExpire).format('YYYY-MM-DD') || moment().format());

    // Loop through the inventoryDetails and set default values for each item
    selectedMachine.inventoryDetails.forEach((inventory, index) => {
      setValue(`inventoryDetails.${index}.type`, inventory.invetrytypes._id || '');
      setValue(`inventoryDetails.${index}.brand`, inventory.brand?._id || '');
      setValue(`inventoryDetails.${index}._id`, inventory._id || '');
      setValue(`inventoryDetails.${index}.resellerWarrantyStart`, moment(inventory.resellerWarrantyStart).format('YYYY-MM-DD') || moment().format());
      setValue(`inventoryDetails.${index}.resellerWarrantyExpire`, moment(inventory.resellerWarrantyExpire).format('YYYY-MM-DD') || moment().format());
    });
  }
}, [selectedMachine, setValue]);;

  

  // Fetch data for the cascading dropdowns
  useEffect(() => {
     if(unassignedInventories)
     {
      setTypeOptions(unassignedInventories);
     }
  }, [unassignedInventories]);


  // Handle brand change, fetch corresponding brand options
  const handleBrandChange = (selectedType) => {
    // Fetch brands data based on selected type (e.g., from an API or Redux store)
    // Sample data, replace with your actual data retrieval
    const brandsData = [
      { id: 'brand1', name: 'Brand 1', type: 'type1' },
      { id: 'brand2', name: 'Brand 2', type: 'type1' },
      { id: 'brand3', name: 'Brand 3', type: 'type2' },
      // Add more brands as needed
    ];
    const filteredInventryBrands = unassignedInventories
    .map(item => item.invetrybrands) // Extract all invetrybrands arrays
    .flat() // Flatten the array of arrays into a single array
    .filter(brand => brand.inventryTypeId === selectedType);
    setBrandOptions(filteredInventryBrands);
    // Clear _id options when the brand changes
    setIdOptions([]);
  };

  // Handle _id change, fetch corresponding _id options
  const handleIdChange = (selectedBrand) => {
    // Fetch _id data based on selected brand (e.g., from an API or Redux store)
    // Sample data, replace with your actual data retrieval
    // const idData = [
    //   { id: 'id1', name: 'ID 1', brand: 'brand1' },
    //   { id: 'id2', name: 'ID 2', brand: 'brand1' },
    //   { id: 'id3', name: 'ID 3', brand: 'brand2' },
    //   { id: 'id4', name: 'ID 4', brand: 'brand3' },
    //   // Add more _ids as needed
    // ];

    const filteredInvetries = brandOptions
    .map(item => item.invetries)
    .flat()
    .filter(inventory => inventory.brandId === selectedBrand);
    console.log(filteredInvetries);
    // const filteredIds = idData.filter((id) => id.brand === selectedBrand);
    setIdOptions(filteredInvetries);
  };

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

        {/* Machine Details */}
        <TextField
          label="Machine ID"
          {...register('machineId')}
          error={!!errors.machineId}
          helperText={errors.machineId?.message}
        />
        <TextField
          label="Reseller ID"
          {...register('resellerId')}
          error={!!errors.resellerId}
          helperText={errors.resellerId?.message}
        />
        <TextField
          label="Customer ID (Optional)"
          {...register('customerId')}
          error={!!errors.customerId}
          helperText={errors.customerId?.message}
        />
        <TextField
          label="Branch ID (Optional)"
          {...register('branchId')}
          error={!!errors.branchId}
          helperText={errors.branchId?.message}
        />
        <TextField
          // label="Warranty Start Date"
          type="date"
          {...register('warrentyStart')}
          error={!!errors.warrentyStart}
          helperText={errors.warrentyStart?.message}
        />
        <TextField
          // label="Warranty Expire Date"
          type="date"
          {...register('warrentyExpire')}
          error={!!errors.warrentyExpire}
          helperText={errors.warrentyExpire?.message}
        />

        {/* Inventory Details */}
        {fields.map((field, index) => (
          <div key={field.id}>
            <Typography variant="h6">Inventory {index + 1}</Typography>
            <Controller
              name={`inventoryDetails.${index}.type`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth error={!!errors?.inventoryDetails?.[index]?.type}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleBrandChange(e.target.value);
                    }}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    {typeOptions.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.inventoryDetails?.[index]?.type?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name={`inventoryDetails.${index}.brand`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth error={!!errors?.inventoryDetails?.[index]?.brand}>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleIdChange(e.target.value);
                    }}
                  >
                    <MenuItem value="">Select Brand</MenuItem>
                    {brandOptions.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.inventoryDetails?.[index]?.brand?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name={`inventoryDetails.${index}._id`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth error={!!errors?.inventoryDetails?.[index]?._id}>
                  <InputLabel>_id</InputLabel>
                  <Select {...field}>
                    <MenuItem value="">Select _id</MenuItem>
                    {idOptions.map((id) => (
                      <MenuItem key={id._id} value={id._id}>
                        {id.serialNumber}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors?.inventoryDetails?.[index]?._id?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <TextField
              // label="Reseller Warranty Start Date"
              type="date"
              {...register(`inventoryDetails.${index}.resellerWarrantyStart`)}
              error={!!errors?.inventoryDetails?.[index]?.resellerWarrantyStart}
              helperText={errors?.inventoryDetails?.[index]?.resellerWarrantyStart?.message}
            />
            <TextField
              // label="Reseller Warranty Expire Date"
              type="date"
              {...register(`inventoryDetails.${index}.resellerWarrantyExpire`)}
              error={!!errors?.inventoryDetails?.[index]?.resellerWarrantyExpire}
              helperText={errors?.inventoryDetails?.[index]?.resellerWarrantyExpire?.message}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove Inventory
            </Button>
          </div>
        ))}

        <Button type="button" onClick={() => append({})}>
          Add Inventory
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
