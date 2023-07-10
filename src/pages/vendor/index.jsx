import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Delete, Edit } from '@mui/icons-material'
import { FiGitBranch } from 'react-icons/fi'

const index = () => {
    const [selectedVendor, setSelectedVendor] = useState(null);
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
          Add Customer
        </Button>
      </Box>
    );
  };
  return (
    <Layout>
         <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Vendor
      </Typography>
      <>
        <AdminTable
          data={allcustomers}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
        />
        </>
    </Layout>
  )
}

export default index