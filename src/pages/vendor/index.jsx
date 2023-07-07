import Layout from '@/layout/Layout'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Typography,
  Box,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import AdminTable from '@/components/AdminTable/AdminTable';
import { createNewVendor, deleteVendor, fetchAllVendors, updateVendor } from '@/redux/reducers/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExportToCsv } from 'export-to-csv';
import { Delete, Edit } from '@mui/icons-material';
import { FiGitBranch } from 'react-icons/fi';
import AddEditVendorSidebar from '@/components/vendor/AddEditVendorSidebar';
import DeleteVendorModal from '@/components/vendor/DeleteVendorModal';
import { toast } from 'react-hot-toast';
import AddEditVendorCustomerSidebar from '@/components/vendor/AddEditVendorCustomerSidebar';
import { createNewCustomer, deleteCustomer, fetchAllCustomers, updateCustomer } from '@/redux/reducers/customerSlice';
import DeleteCustomerModal from '@/components/customer/DeleteCustomerModal';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

const index = () => {
  const allvendors = useSelector((state) => state.vendor)
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [isDeleteVendorModalOpen, setIsDeleteVendorModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [isAddCustomerSidebarOpen, setIsAddCustomerSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteCustomerModalOpen, setIsDeleteCustomerModalOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllVendors());
    };

    fetchData();
  }, [dispatch]);
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
      {
        accessorKey: 'email',
        header: 'Email',
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
          Add Reseller
        </Button>
      </Box>
    );
  };
  const handleOpenAddSidebar = () => {
    setSelectedVendor(null)
    setIsAddSidebarOpen(true);
  };
  const handleAddVendor = async (vendorData) => {
    if (selectedVendor) {
      // Update existing customer
      const updatedVendorData={
        id:selectedVendor._id,
        data:vendorData
      }
      console.log(updatedVendorData);
      try {
        dispatch(updateVendor(updatedVendorData))
        toast.success('Vendor Updated Successfully')
      } catch (error) {
        console.log(error);
      }
      console.log('Updating vendor', vendorData);
    } else {
      // Add new customer
      try {
        dispatch(createNewVendor(vendorData))
        toast.success('Vendor Added Successfully')
      } catch (error) {
        console.log(error);
      }
      console.log('Add vendor', vendorData);
    }
    handleCloseAddSidebar();
  };
  const handleEditVendor = (vendorData) => {
    setSelectedVendor(vendorData);
    setIsAddSidebarOpen(true);
  };
  const handleDeleteVendor = (vendorData) => {
    setSelectedVendor(vendorData);
    setIsDeleteVendorModalOpen(true);
  };
  const handleOpenAddCustomerSidebar = (vendorData) => {
    setSelectedCustomer(null);
    setIsAddCustomerSidebarOpen(true);
    setSelectedVendor(vendorData);
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Vendor">
          <IconButton onClick={() => handleEditVendor(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Vendor">
          <IconButton color="error" onClick={() => handleDeleteVendor(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Add Customer">
          <IconButton color="secondary" onClick={() => handleOpenAddCustomerSidebar(row.original)}>
            <AiOutlineUsergroupAdd />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleEditCustomer = (customerData) => {
    setSelectedCustomer(customerData);
    setIsAddCustomerSidebarOpen(true);
  };
  const handleDeleteCustomer = (customerData) => {
    setSelectedCustomer(customerData);
    setIsDeleteCustomerModalOpen(true);
  };
  const handleAdminNestedTableRowActions = (row, table) => {
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
      </Box>
    );
  };
  const handleNestedTable = (row) => {
    const nestedTableConfigurations = [
      {
        header: 'customers',
        columns: [{ header: 'Name', accessorKey: 'name' }],
        data: row?.original?.customers,
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
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteVendorModalOpen(false);
  };
  const handleConfirmDeleteVendor = async () => {
    try {
     await dispatch(deleteVendor(selectedVendor._id))
      toast.success('Vendor Delete Successfully')
    } catch (error) {
      console.log(error);
    }
    console.log('Deleting branch', selectedVendor);
    setIsDeleteVendorModalOpen(false);
  };
  const handleCloseAddCustomerSidebar = () => {
    setIsAddCustomerSidebarOpen(false);
  };
  const handleAddCustomer = async (customerData) => {
    if (selectedCustomer) {
      // Update existing branch
      const newCustomer={
        id:selectedCustomer._id,
        name:customerData.name
      }
      await dispatch(updateCustomer(newCustomer))
      await dispatch(fetchAllVendors())
      .then(() => {
        // Handle success case here
        toast.success('Customer update successfully');
      })
      console.log('Updating branch', customerData);
    } else {
      const newCustomerData={
        name:customerData?.name,
        vendorId:selectedVendor?._id,
        branchName:customerData?.branchName
      }
      try {
        await dispatch(createNewCustomer(newCustomerData))
        await dispatch(fetchAllVendors())
      } catch (error) {
        console.log(error);
      }
      console.log('Adding branch', selectedVendor._id,customerData);
    }
    handleCloseAddCustomerSidebar();
  };
  const handleConfirmDeleteCustomer = () => {
    dispatch(deleteCustomer(selectedCustomer))
    .unwrap()
    .then((originalPromiseResult) => {
      console.log(originalPromiseResult);
      toast.success('Customer Delete Successfully')
        setIsDeleteCustomerModalOpen(false);
    })
    .catch((rejectedValueOrSerializedError) => {
      toast.error(rejectedValueOrSerializedError)
      setIsDeleteCustomerModalOpen(false);
    })
  };
  const handleCloseCustomerDeleteModal = () => {
    setIsDeleteCustomerModalOpen(false);
  };
  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Reseller
      </Typography>
      <AdminTable
        data={allvendors}
        handleToolBar={handleToolBar}
        columns={mainTableColumns}
        handleAdminTableRowActions={handleAdminTableRowActions}
        handleNestedTable={handleNestedTable}
      />
      {isAddSidebarOpen && (
        <AddEditVendorSidebar
          onClose={handleCloseAddSidebar}
          onSubmit={handleAddVendor}
          selectedVendor={selectedVendor}
        />
      )}
      {isAddCustomerSidebarOpen && (
          <AddEditVendorCustomerSidebar
            onClose={handleCloseAddCustomerSidebar}
            onSubmit={handleAddCustomer}
            selectedCustomer={selectedCustomer}
            // selectedCustomer={selectedCustomer}
          />
        )}
      <DeleteVendorModal
        isOpen={isDeleteVendorModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDeleteVendor}
        title='Vendor'
      />
      <DeleteCustomerModal
          isOpen={isDeleteCustomerModalOpen}
          onClose={handleCloseCustomerDeleteModal}
          onDelete={handleConfirmDeleteCustomer}
          title='Customer'
        />
    </Layout>
  )
}

export default index