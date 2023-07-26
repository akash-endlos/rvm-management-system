import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Delete, Edit } from '@mui/icons-material'
import { FiGitBranch } from 'react-icons/fi'
import { createNewLocalVendor, deleteLocalVendor, fetchAllLocalVendors, updateLocalVendor } from '@/redux/reducers/localVendorSlice'
import { toast } from 'react-hot-toast'
import AddEditLocalVendorSidebar from '@/components/localVendor/AddEditLocalVendorSidebar'
import DeleteLocalVendor from '@/components/localVendor/DeleteLocalVendor'
import { ExportToCsv } from 'export-to-csv'

const index = () => {


    const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [isDeleteLocalVendorModalOpen, setIsDeleteLocalVendorModalOpen] = useState(false);
    const alllocalVendors = useSelector((state) => state.localvendor)
    console.log(alllocalVendors);
    const dispatch = useDispatch();
    useEffect(() => {
      const fetchData = () => {
        dispatch(fetchAllLocalVendors()).unwrap()
          .then(() => {
            // Success
          })
          .catch(error => {
            toast.error(error);
          });
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
          {
            accessorKey: 'contact',
            header: 'Mobile No.',
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
    
      const handleEditVendor = (vendorData) => {
        setSelectedVendor(vendorData);
        setIsAddSidebarOpen(true);
      };
      const handleDeleteCustomer = (customerData) => {
        setSelectedVendor(customerData);
        setIsDeleteLocalVendorModalOpen(true);
      };
      const handleAdminTableRowActions = (row, table) => {
        return (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit Customer">
              <IconButton onClick={() => handleEditVendor(row.original)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete Customer">
              <IconButton color="error" onClick={() => handleDeleteCustomer(row.original)}>
                <Delete />
              </IconButton>
            </Tooltip>
            {/* <Tooltip arrow placement="right" title="Add Branch">
              <IconButton color="secondary" onClick={() => handleOpenAddBranchSidebar(row.original)}>
                <FiGitBranch />
              </IconButton>
            </Tooltip> */}
          </Box>
        );
      };
      const handleOpenAddSidebar = () => {
        setSelectedVendor(null);
        setIsAddSidebarOpen(true);
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
          Add Vendor
        </Button>
      </Box>
    );
  };
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
    const handleAddVendor = async (vendorData) => {
    if (selectedVendor) {
      // Update existing customer
      const updatedData={
        id:selectedVendor._id,
        data:vendorData
      }
      console.log(selectedVendor);
      dispatch(updateLocalVendor(updatedData)).unwrap().then(()=>{
        toast.success('Updated Vendor Successfully')
    }).catch((error)=>{
        toast.error(error)
    })
      console.log('Updating customer', vendorData);
    } else {
        dispatch(createNewLocalVendor(vendorData)).unwrap().then(()=>{
            toast.success('Create Vendor Successfully')
        }).catch((error)=>{
            toast.error(error)
        })
        console.log('Add customer', vendorData);
    }
    handleCloseAddSidebar();
  };
  const handleCloseDeleteLocalVendorModal=()=>{
    setIsDeleteLocalVendorModalOpen(false)
  }
  const handleConfirmDeleteVendor = () => {
    dispatch(deleteLocalVendor(selectedVendor)).unwrap()
      .then(() => {
        toast.success('Vendor Delete Successfully')
        setIsDeleteLocalVendorModalOpen(false);
      })
      .catch((error) => {
        toast.error(error)
        setIsDeleteLocalVendorModalOpen(false);
        console.error('Error deleting customer:', error);
      });
  };
  return (
    <Layout>
         <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Vendor
      </Typography>
      <>
        <AdminTable
          data={alllocalVendors}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
        />
        {isAddSidebarOpen && (
          <AddEditLocalVendorSidebar
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddVendor}
            selectedVendor={selectedVendor}
          />
        )}
         <DeleteLocalVendor
          isOpen={isDeleteLocalVendorModalOpen}
          onClose={handleCloseDeleteLocalVendorModal}
          onDelete={handleConfirmDeleteVendor}
          title='Vendor'
        />
        </>
    </Layout>
  )
}

export default index