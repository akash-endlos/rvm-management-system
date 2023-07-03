import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TableContainer,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { FiGitBranch } from 'react-icons/fi';
import DeleteModal from '@/components/customer/DeleteCustomerModal';
import AddEditBranchSidebar from '@/components/customer/AddEditBranchSidebar';
import DeleteCustomerModal from '@/components/customer/DeleteCustomerModal';
import DeleteBranchModal from '@/components/customer/DeleteBranchModal';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  vendorId: yup.string().required('Vendor ID is required'),
  branchName: yup.string().optional(),
});

const Index = () => {
  const dispatch = useDispatch();
  const allCustomers = useSelector((state) => state?.customer?.Customer);
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddBranchSidebarOpen, setIsAddBranchSidebarOpen] = useState(false); // New state for AddEditBranchSidebar
  const [selectedBranch, setSelectedBranch] = useState(null); // New state for AddEditBranchSidebar

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
    []
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
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditCustomer(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteCustomer(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Add Branch">
          <IconButton color="secondary" onClick={() => handleOpenAddBranchSidebar(row.original)}>
            <FiGitBranch />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditBranch(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteBranch(row.original)}>
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
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
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
            <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
              {config?.header}
            </Typography>
            <AdminNestedTable handleAdminNestedTableRowActions={handleAdminNestedTableRowActions} columns={config?.columns} data={config?.data} />
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

  const handleDeleteCustomer = (customerData) => {
    setSelectedCustomer(customerData);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteBranch = (branchData) => {
    setSelectedBranch(branchData);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDeleteCustomer = () => {
    // Perform delete operation on selectedCustomer
    console.log('Deleting customer', selectedCustomer);
    setIsDeleteModalOpen(false);
  };
  const handleConfirmDeleteBranch = () => {
    // Perform delete operation on selectedCustomer
    console.log('Deleting branch', selectedBranch);
    setIsDeleteModalOpen(false);
  };

  const handleOpenAddBranchSidebar = (customerData) => {
    setSelectedBranch(null);
    setIsAddBranchSidebarOpen(true);
    setSelectedCustomer(customerData);
  };

  const handleCloseAddBranchSidebar = () => {
    setIsAddBranchSidebarOpen(false);
  };

  const handleEditBranch = (branchData) => {
    setSelectedBranch(branchData);
    setIsAddBranchSidebarOpen(true);
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

  const handleAddBranch = (branchData) => {
    if (selectedBranch) {
      // Update existing branch
      console.log('Updating branch', branchData);
    } else {
      // Add new branch
      console.log('Adding branch', branchData);
    }
    handleCloseAddBranchSidebar();
  };

  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Customers
      </Typography>
      {allCustomers && (
        <>
          <AdminTable
            data={allCustomers}
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
          {isAddBranchSidebarOpen && (
            <AddEditBranchSidebar
              onClose={handleCloseAddBranchSidebar}
              onSubmit={handleAddBranch}
              selectedBranch={selectedBranch}
              selectedCustomer={selectedCustomer}
            />
          )}
          <DeleteCustomerModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onDelete={handleConfirmDeleteCustomer}
            title='Customer'
          />
           <DeleteBranchModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onDelete={handleConfirmDeleteBranch}
            title='Branch'
          />
        </>
      )}
    </Layout>
  );
};

export default Index;
