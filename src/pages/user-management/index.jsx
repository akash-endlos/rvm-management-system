import AdminNestedTable from '@/components/AdminTable/AdminNestedTable'
import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { createNewRole, deleteRole, fetchAllRoles, updateRole } from '@/redux/reducers/roleSlice'
import { Delete, Edit } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, Input, TableCell, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { FiGitBranch } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddEditRoleSidebar from '@/components/user-management/AddEditRoleSidebar'
import { toast } from 'react-hot-toast'
import DeleteRoleModal from '@/components/user-management/DeleteRoleModal'
import AddEditUserSidebar from '@/components/user-management/AddEditUserSidebar'
import { createUser, deleteUser, updateUser } from '@/redux/reducers/userSlice'
import DeleteUserModal from '@/components/user-management/DeleteUserModal'
import { deleteUserApi } from '@/redux/api/userApi'
import { ExportToCsv } from 'export-to-csv'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAddUserSidebarOpen, setIsAddUserSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const allusers = useSelector((state) => state.roles)
  console.log(allusers);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchAllRoles())
        .then(() => {
          // Handle success
        })
        .catch(error => {
          console.log(error);
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
        accessorKey: 'roleName',
        header: 'Name',
        size: 150,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 150,
      },
      {
        accessorKey: 'isActive',
        header: 'Active/Disabled',
        size: 150,
        Cell: ({ renderedCellValue }) => {
          return(
            <Chip label={renderedCellValue ? 'Active' : 'Disabled'} color={renderedCellValue ? 'primary' : 'default'} />
        )},
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
  const handleEditCustomer = (roleData) => {
    setSelectedRole(roleData);
    setIsAddSidebarOpen(true);
  };
  const handleOpenAddUserSidebar = (roleData) => {
    setSelectedUser(null);
    setIsAddUserSidebarOpen(true);
    setSelectedRole(roleData);
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Role">
          <IconButton onClick={() => handleEditCustomer(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Role">
          <IconButton color="error" onClick={() => handleDeleteRole(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Add User">
          <IconButton color="secondary" onClick={() => handleOpenAddUserSidebar(row.original)}>
            <FiGitBranch />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleEditUser = (branchData) => {
    setSelectedUser(branchData);
    setIsAddUserSidebarOpen(true);
  };
  const handleDeleteBranch = (userData) => {
    setSelectedUser(userData);
    setIsDeleteUserModalOpen(true);
  };
  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit User">
          <IconButton onClick={() => handleEditUser(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete User">
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
        header: 'Users',
        columns: [
          { header: 'Name', accessorKey: 'name' },
          { header: 'Mobile', accessorKey: 'mobile' },
          { header: 'Email', accessorKey: 'email' },
          {
            accessorKey: 'isActive',
            header: 'Active/Disabled',
            size: 150,
            Cell: ({ renderedCellValue }) => {
              return(
                <Chip label={renderedCellValue ? 'Active' : 'Disabled'} color={renderedCellValue ? 'primary' : 'default'} />
            )},
            Filter: ({ column }) => (
                <Input
                  onChange={(newValue) => {
                    console.log(newValue.nativeEvent);
                    column.setFilterValue(newValue);
                  }}
                  slotProps={{
                    textField: {
                      helperText: 'Filter Mode: Less Than',
                      sx: { minWidth: '120px' },
                      variant: 'standard',
                    },
                  }}
                  value={column.getFilterValue()}
                />
            ),
          },
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
  const handleAddRole = async (roleData) => {
    if (selectedRole) {
      const updateRoleData={
        id:selectedRole?._id,
        data:roleData
      }
      // Update existing customer
      dispatch(updateRole(updateRoleData)).unwrap()
  .then(async () => {
    handleCloseAddSidebar();
     await dispatch(fetchAllRoles());
    toast.success('Updating tole Successfully')
  })
  .catch(error => {
    toast.error(error);
  })
      console.log('Updating role', roleData);
    } else {
      // Add new customer
      dispatch(createNewRole(roleData)).unwrap()
      .then(() => {
        handleCloseAddSidebar();
      })
      .catch(error => {
        toast.error(error);
      });
    
      console.log('Add customer', roleData);
      // addCustomer(newcustomer.payload);
    }
   
  };
  const handleCloseDeleteRoleModal=()=>{
    setIsDeleteRoleModalOpen(false)
  }
  const handleConfirmDeleteRole = async () => {
    dispatch(deleteRole(selectedRole)).unwrap()
    .then(async () => {
      handleCloseDeleteRoleModal();
      await dispatch(fetchAllCustomers());
      toast.success('Role Deleted Successfully');
    })
    .catch(error => {
      toast.error(error);
      handleCloseDeleteRoleModal();
    });
  
  };
  
  const handleDeleteRole = (roleData) => {
    setSelectedRole(roleData);
    setIsDeleteRoleModalOpen(true);
  };
  const handleCloseAddRoleSidebar = () => {
    setIsAddUserSidebarOpen(false);
  };
  const handleAddUser = async (userData) => {
    if (selectedUser) {
      const newUpdateUser={
        id:selectedUser._id,
        data:userData
       }
       console.log(newUpdateUser);
       dispatch(updateUser(newUpdateUser)).unwrap()
       .then(async () => {
         await dispatch(fetchAllRoles());
        toast.success('User Updated Successfully');
       })
       .catch(error => {
         toast.error(error);
       });
     
      console.log('Updating branch', userData);
    } else {
         const newAddUser={
          role:selectedRole._id,
          name:userData.name,
          mobile:userData.mobile,
          password:userData.password,
          email:userData.email
         }
         dispatch(createUser(newAddUser))
         .unwrap()
         .then(async () => {
           await dispatch(fetchAllRoles());
           toast.success('Roles fetched successfully');
         })
         .catch(error => {
           toast.error(error);
           handleCloseAddRoleSidebar();
         });
       
       
      console.log('Adding branch',newAddUser);
    }
   
  };
  const handleCloseDeleteUserModal=()=>{
    setIsDeleteUserModalOpen(false)
  }
  const handleConfirmDeleteUser = async () => {
    dispatch(deleteUser(selectedUser?._id)).unwrap()
    .then(async () => {
      await dispatch(fetchAllRoles());
      handleCloseDeleteUserModal()
      toast.success('Delete User Successfully');
    })
    .catch(error => {
      toast.error(error);
      handleCloseDeleteUserModal()
    });
  
    // Perform delete operation on selectedCustomer
    console.log('Deleting user', selectedUser);
    // handleCloseDeleteUserModal(false);
  };
  return (
    <Layout> <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
      User Role
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
        <DeleteRoleModal
          isOpen={isDeleteRoleModalOpen}
          onClose={handleCloseDeleteRoleModal}
          onDelete={handleConfirmDeleteRole}
          title='Role'
        />
        {isAddUserSidebarOpen && (
          <AddEditUserSidebar 
            onClose={handleCloseAddRoleSidebar}
            onSubmit={handleAddUser}
            selectedUser={selectedUser}
            // selectedCustomer={selectedCustomer}
          />
        )}
          <DeleteUserModal
          isOpen={isDeleteUserModalOpen}
          onClose={handleCloseDeleteUserModal}
          onDelete={handleConfirmDeleteUser}
          title='User'
        />
        </></Layout>
  )
}

export default index