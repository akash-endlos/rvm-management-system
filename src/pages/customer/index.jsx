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
import { addCustomer, createNewCustomer, deleteCustomer, fetchAllCustomers, fetchCustomer, setCustomers, updateCustomer } from '@/redux/reducers/customerSlice';
import AddEditCustomerSidebar from '@/components/customer/AddEditCustomerSidebar';
import { FiGitBranch } from 'react-icons/fi';
import AddEditBranchSidebar from '@/components/customer/AddEditBranchSidebar';
import DeleteCustomerModal from '@/components/customer/DeleteCustomerModal';
import { toast } from 'react-hot-toast';
import DeleteBranchModal from '@/components/customer/DeleteBranchModal';
import { createNewBranch, deleteBranch, updateBranch } from '@/redux/reducers/branchSlice';
import { updateBranchApi } from '@/redux/api/branchApi';

const Index = () => {
  const allcustomers = useSelector((state) => state.customer)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchAllCustomers()).unwrap()
        .then(() => {
          // Success
        })
        .catch(error => {
          toast.error(error);
        });
    };
  
    fetchData();
  }, [dispatch]);
  
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);
  const [isDeleteBranchModalOpen, setIsDeleteBranchModalOpen] = useState(false);
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
    setIsDeleteCustomerModalOpen(true);
  };
  const handleDeleteBranch = (branchData) => {
    setSelectedBranch(branchData);
    setIsDeleteBranchModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteCustomerModalOpen(false);
  };
  const handleCloseDeleteBranchModal=()=>{
    setIsDeleteBranchModalOpen(false)
  }

  const handleConfirmDeleteCustomer = () => {
    dispatch(deleteCustomer(selectedCustomer)).unwrap()
      .then(() => {
        toast.success('Customer Delete Successfully')
        setIsDeleteCustomerModalOpen(false);
      })
      .catch((error) => {
        toast.error(error)
        setIsDeleteCustomerModalOpen(false);
        console.error('Error deleting customer:', error);
      });
  };
  
  const handleConfirmDeleteBranch = async () => {
    dispatch(deleteBranch(selectedBranch?._id))
    .then(async () => {
      await dispatch(fetchAllCustomers());
      toast.success('Delete Branch Successfully');
    })
    .catch(error => {
      toast.error(error);
    });
  
    // Perform delete operation on selectedCustomer
    console.log('Deleting branch', selectedBranch);
    setIsDeleteBranchModalOpen(false);
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

  const handleAddCustomer = async (customerData) => {
    if (selectedCustomer) {
      // Update existing customer
      const newCustomer={
        id:selectedCustomer._id,
        name:customerData.name
      }
      dispatch(updateCustomer(newCustomer)).unwrap()
      .then(() => {
        // Handle success case here
        toast.success('Customer update successfully');
      })
      .catch((error) => {
        // Handle error case here
        toast.error(error)
        console.error('Error updating customer:', error);
      });
      console.log('Updating customer', customerData);
    } else {
      // Add new customer
      dispatch(createNewCustomer(customerData)).unwrap()
    .then(() => {
      toast.success('Customer added successfully');
    })
    .catch((error) => {
      toast.error(error)
      console.error('Failed to add customer', error);
      // Handle the error, show an error message, or perform other actions
    });
      // addCustomer(newcustomer.payload);
    }
    handleCloseAddSidebar();
  };
  const handleAddBranch = async (branchData) => {
    if (selectedBranch) {
      // Update existing branch
      const updateNewData={
        id:selectedBranch?._id,
        name:branchData?.branchName
      }
      dispatch(updateBranch(updateNewData)).unwrap()
      .then(async () => {
       await dispatch(fetchAllCustomers());
        toast.success('Branch Update Successfully');
      })
      .catch(error => {
        toast.error(error);
      });
    
      console.log('Updating branch', branchData);
    } else {
      const addNewData={
        customerId:selectedCustomer?._id,
        name:branchData?.branchName
      }
      // Add new branch
        dispatch(createNewBranch(addNewData)).unwrap()
        .then(async() => {
          await dispatch(fetchAllCustomers());
          toast.success('Branch Added Successfully');
        })
        .catch(error => {
          toast.error(error);
        });
      // console.log('Adding branch', addNewData,branchData);
    }
    handleCloseAddBranchSidebar();
  };

  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Customers
      </Typography>
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
        {isAddBranchSidebarOpen && (
          <AddEditBranchSidebar
            onClose={handleCloseAddBranchSidebar}
            onSubmit={handleAddBranch}
            selectedBranch={selectedBranch}
            // selectedCustomer={selectedCustomer}
          />
        )}
        <DeleteCustomerModal
          isOpen={isDeleteCustomerModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteCustomer}
          title='Customer'
        />
        <DeleteBranchModal
          isOpen={isDeleteBranchModalOpen}
          onClose={handleCloseDeleteBranchModal}
          onDelete={handleConfirmDeleteBranch}
          title='Branch'
        />
      </>
    </Layout>
  );
};

export default Index;
