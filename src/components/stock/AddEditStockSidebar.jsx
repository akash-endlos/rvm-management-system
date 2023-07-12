import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { fetchAllVendors } from '@/redux/reducers/vendorSlice';

const schema = yup.object().shape({
  vendorId: yup.string().required('Vendor is required'),
  invoiceNumber: yup.string().required('Invoice number is required'),
  invoiceDate: yup.date().required('Invoice date is required'),
  inventry: yup
    .array()
    .of(
      yup.object().shape({
        brandId: yup.string().required('Brand is required'),
        warrantyStart: yup.date().required('Warranty start date is required'),
        purchaseDate: yup.date(),
        warrantyExpire: yup.date(),
        serialNumber: yup.array().of(yup.string()).required('Serial number is required'),
        purchaseRate: yup.number().required('Purchase rate is required'),
      })
    )
    .required('Inventory is required'),
});

// const inventryTypeOptions = [
//   { id: '1', name: 'Type 1' },
//   { id: '2', name: 'Type 2' },
//   { id: '3', name: 'Type 3' },
// ];

// const inventryBrandOptions = {
//   '1': [
//     { id: '11', name: 'Brand 1.1' },
//     { id: '12', name: 'Brand 1.2' },
//     { id: '13', name: 'Brand 1.3' },
//   ],
//   '2': [
//     { id: '21', name: 'Brand 2.1' },
//     { id: '22', name: 'Brand 2.2' },
//     { id: '23', name: 'Brand 2.3' },
//   ],
//   '3': [
//     { id: '31', name: 'Brand 3.1' },
//     { id: '32', name: 'Brand 3.2' },
//     { id: '33', name: 'Brand 3.3' },
//   ],
// };

const AddEditStockSidebar = ({ onClose, onSubmit, selectedVendor,inventryTypeOptions,localVendorsOptions }) => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllVendors());
  }, []);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      vendorId: selectedVendor?.vendorId || '',
      invoiceNumber: selectedVendor?.invoiceNumber || '',
      invoiceDate: selectedVendor?.invoiceDate || null,
      inventry: [
        {
          brandId: '',
          warrantyStart: null,
          purchaseDate: null,
          warrantyExpire: null,
          serialNumber: [''],
          purchaseRate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventry',
  });

  const [inventryBrands, setInventryBrands] = useState([]);
  const [selectedInventryType, setSelectedInventryType] = useState('');
  console.log(selectedInventryType);
  const handleInventryTypeChange = (event) => {
    const selectedTypeId = event.target.value;
    setSelectedInventryType(selectedTypeId);
    setValue('inventryBrandId', ''); // Reset the brand selection
  };

  useEffect(() => {
    const brands = inventryTypeOptions
    .filter((type) => type._id === selectedInventryType)
    .flatMap((type) => type.invetrybrands);
   console.log(brands);
    // const brands = inventryBrandOptions[selectedInventryType] || [];
    setInventryBrands(brands);
    setValue('inventryBrandId', ''); // Reset the brand selection
  }, [selectedInventryType]);

  const handleFormSubmit = (data) => {
    // Check if invoiceDate is empty string
    if (!data.invoiceDate) {
      setValue('invoiceDate', null); // Set invoiceDate to null
    }
    const updatedData = {
      ...data,
      inventry: data.inventry.map((item) => ({
        ...item,
        serialNumber: item.serialNumber[0].split(',').map((serial) => serial.trim()),
      })),
    };
    onSubmit(updatedData);
    
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
        overflowY:"scroll"
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
          Stock
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Select
              fullWidth
              label="Vendor"
              name="vendorId"
              {...register('vendorId')}
              error={!!errors.vendorId}
            >
              <MenuItem value="" disabled>
                Select Vendor
              </MenuItem>
              {localVendorsOptions.map((item,index)=>(
              <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
              ))}
            </Select>
            <div style={{ color: 'red' }}>{errors.vendorId?.message}</div>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              name="invoiceNumber"
              {...register('invoiceNumber')}
            />
            <div style={{ color: 'red' }}>{errors.invoiceNumber?.message}</div>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Invoice Date"
              type="date"
              name="invoiceDate"
              {...register('invoiceDate')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div style={{ color: 'red' }}>{errors.invoiceDate?.message}</div>
          </Grid>
          {fields.map((item, index) => (
            <Grid px={2} py={2} container spacing={2} key={item.id}>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  label="Inventry Type"
                  name="inventryTypeId"
                  {...register('inventryTypeId')}
                  error={!!errors.inventryTypeId}
                  onChange={handleInventryTypeChange}
                >
                  <MenuItem value="" disabled>
                    Select Inventry Type
                  </MenuItem>
                  {inventryTypeOptions.map((type) => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ color: 'red' }}>{errors.inventryTypeId?.message}</div>
              </Grid>
              <Grid item xs={12}>
                <Select
                  fullWidth
                  label="Brand"
                  name={`inventry[${index}].brandId`}
                  {...register(`inventry[${index}].brandId`)}
                  error={!!errors?.inventry?.[index]?.brandId}
                >
                  <MenuItem value="" disabled>
                    Select Brand
                  </MenuItem>
                  {inventryBrands?.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
                <div style={{ color: 'red' }}>
                  {errors?.inventry?.[index]?.brandId?.message}
                </div>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Warranty Start"
                  type="date"
                  name={`inventry[${index}].warrantyStart`}
                  {...register(`inventry[${index}].warrantyStart`)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div style={{ color: 'red' }}>
                  {errors?.inventry?.[index]?.warrantyStart?.message}
                </div>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  type="date"
                  name={`inventry[${index}].purchaseDate`}
                  {...register(`inventry[${index}].purchaseDate`)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div style={{ color: 'red' }}>
                  {errors?.inventry?.[index]?.purchaseDate?.message}
                </div>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Warranty Expire"
                  type="date"
                  name={`inventry[${index}].warrantyExpire`}
                  {...register(`inventry[${index}].warrantyExpire`)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div style={{ color: 'red' }}>
                  {errors?.inventry?.[index]?.warrantyExpire?.message}
                </div>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Purchase Rate"
                  name={`inventry[${index}].purchaseRate`}
                  {...register(`inventry[${index}].purchaseRate`)}
                />
                <div style={{ color: 'red' }}>
                  {errors?.inventry?.[index]?.purchaseRate?.message}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Serial Number</Typography>
                {item.serialNumber.map((serial, serialIndex) => (
                  <TextField
                    key={serialIndex}
                    fullWidth
                    label={`Serial Number`}
                    name={`inventry[${index}].serialNumber[${serialIndex}]`}
                    {...register(`inventry[${index}].serialNumber[${serialIndex}]`)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                ))}
                <div style={{ color: 'red' }}>
                  {errors?.inventry?.[index]?.serialNumber?.message}
                </div>
                <Button
                  type="button"
                  color="secondary"
                  variant="contained"
                  onClick={() => remove(index)}
                >
                  Remove Serial Number
                </Button>
                <Button
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={() => append({ serialNumber: [''] })}
                >
                  Add Serial Number
                </Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginRight: '10px' }}
        >
          {selectedVendor ? 'Update' : 'Submit'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </form>
    </div>
  );
};

export default AddEditStockSidebar;
