import AdminNestedTable from '@/components/AdminTable/AdminNestedTable'
import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { createNewRole, fetchAllRoles } from '@/redux/reducers/roleSlice'
import { Delete, Edit } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { FiGitBranch } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddEditRoleSidebar from '@/components/user-management/AddEditRoleSidebar'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const allusers = useSelector((state) => state.roles)
  console.log(allusers);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllRoles());
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
        accessorKey: 'roleName',
        header: 'Name',
        size: 150,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 150,
      },
    ],
    []
  );
  const handleOpenAddSidebar = () => {
    setSelectedRole(null);
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
          Add Role
        </Button>
      </Box>
    );
  };
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
  const handleNestedTable = (row) => {
    const nestedTableConfigurations = [
      {
        header: 'branches',
        columns: [
          { header: 'Name', accessorKey: 'name' },
          { header: 'Mobile', accessorKey: 'mobile' },
          { header: 'Email', accessorKey: 'email' }
      ],
        data: row?.original?.users,
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
  const handleAddRole = async (customerData) => {
    if (selectedRole) {
      // Update existing customer

      console.log('Updating customer', customerData);
    } else {
      // Add new customer
      dispatch(createNewRole(customerData))
      console.log('Add customer', customerData);
      // addCustomer(newcustomer.payload);
    }
    handleCloseAddSidebar();
  };
  return (
    <Layout> <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
      User Management
    </Typography>
      <>
        <AdminTable
          data={allusers}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
          handleNestedTable={handleNestedTable}
        />
          {isAddSidebarOpen && (
          <AddEditRoleSidebar
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddRole}
            selectedRole={selectedRole}
          />
        )}
        </></Layout>
  )
}

export default index