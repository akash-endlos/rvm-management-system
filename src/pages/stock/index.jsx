import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllLocalVendors } from '@/redux/reducers/localVendorSlice'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Delete, Edit } from '@mui/icons-material'
import AddEditStockSidebar from '@/components/stock/AddEditStockSidebar'
import DeleteStockModal from '@/components/stock/DeleteStockModal'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isDeleteStockModalOpen, setIsDeleteStockModalOpen] = useState(false);
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
    const handleEditVendor = (stockData) => {
      setSelectedStock(stockData);
      setIsAddSidebarOpen(true);
    };
    const handleDeleteVendor = (customerData) => {
      setSelectedStock(customerData);
      setIsDeleteStockModalOpen(true);
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
            <IconButton color="error" onClick={() => handleDeleteVendor(row.original)}>
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
      setSelectedStock(null);
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
          Add Stock
        </Button>
      </Box>
    );
  };
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
  const handleAddStock = async (stockData) => {
    if (selectedStock) {
      // Update existing customer

      console.log('Updating customer', stockData);
    } else {
       
        console.log('Add customer', stockData);
    }
    handleCloseAddSidebar();
  };
  const handleCloseDeleteStockModal=()=>{
    setIsDeleteStockModalOpen(false)
  }
  const handleConfirmDeleteVendor = () => {
console.log(selectedStock);
  };
  return (
    <Layout>
    <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
   Stock
 </Typography>
 <>
   <AdminTable
     data={alllocalVendors}
     handleToolBar={handleToolBar}
     columns={mainTableColumns}
     handleAdminTableRowActions={handleAdminTableRowActions}
   />
    {isAddSidebarOpen && (
          <AddEditStockSidebar
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddStock}
            selectedStock={selectedStock}
          />
        )}
         <DeleteStockModal
          isOpen={isDeleteStockModalOpen}
          onClose={handleCloseDeleteStockModal}
          onDelete={handleConfirmDeleteVendor}
          title='Stock'
        />
   </>
</Layout>
  )
}

export default index