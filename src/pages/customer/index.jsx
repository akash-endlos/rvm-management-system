import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { ExportToCsv } from 'export-to-csv';
import { useDispatch, useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AdminNestedTable from '@/components/AdminTable/AdminNestedTable';
import AdminTable from '@/components/AdminTable/AdminTable';
import Layout from '@/layout/Layout';
import { fetchAllCustomers } from '@/redux/reducers/customerSlice';
import AddEditCustomerSidebar from '@/components/customer/AddEditCustomerSidebar';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  vendorId: yup.string().required('Vendor ID is required'),
  branchName: yup.string().optional(),
});

const index = () => {
  const dispatch = useDispatch();
  const allcustomers = useSelector((state) => state?.customer?.Customer);
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const mainTableColumns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'Sr. No',
        size: 150,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 150,
      },
    ],
    [],
  );

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: mainTableColumns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit">
          <IconButton onClick={() => handleEditCustomer(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete">
          <IconButton color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const handleToolBar = (table) => {
    const handleExportRows = (rows) => {
      csvExporter.generateCsv(rows.map((row) => row.original));
    };
    return (
      <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
          variant="contained"
        >
          Export All Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
          variant="contained"
        >
          Export Selected Rows
        </Button>
        <Button variant="contained" onClick={handleOpenAddSidebar}>
          Add Customer
        </Button>
      </Box>
    );
  };

  const handleNestedTable = (row) => {
    const nestedTableConfigurations = [
      {
        header: 'branches',
        columns: [{ header: 'Name', accessorKey: 'name' }],
        data: row?.original?.branches,
      },
    ];
    return (
      <>
        {nestedTableConfigurations.map((config, index) => (
          <>
            <Typography
              variant="h5"
              style={{ fontWeight: 'bold', color: 'teal' }}
            >
              {config?.header}
            </Typography>
            <AdminNestedTable columns={config?.columns} data={config?.data} />
          </>
        ))}
      </>
    );
  };

  const handleOpenAddSidebar = () => {
    setSelectedCustomer(null);
    setIsAddSidebarOpen(true);
  };

  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };

  const handleEditCustomer = (customerData) => {
    setSelectedCustomer(customerData);
    setIsAddSidebarOpen(true);
  };

  const handleAddCustomer = (customerData) => {
    if (selectedCustomer) {
      // Update existing customer
      console.log('Updating customer', customerData);
    } else {
      // Add new customer
      console.log('Adding customer', customerData);
    }
    handleCloseAddSidebar();
  };

  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Customers
      </Typography>
      {allcustomers && (
        <>
          <AdminTable
            data={allcustomers}
            handleToolBar={handleToolBar}
            columns={mainTableColumns}
            handleAdminTableRowActions={handleAdminTableRowActions}
            handleNestedTable={handleNestedTable}
          />
          {isAddSidebarOpen && (
            <AddEditCustomerSidebar
              onClose={handleCloseAddSidebar}
              onSubmit={handleAddCustomer}
              selectedCustomer={selectedCustomer}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default index;
