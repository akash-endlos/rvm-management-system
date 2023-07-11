import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { Delete, Edit } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { FiGitBranch } from 'react-icons/fi'
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable'
import AddEditMachineSidebar from '@/components/machine/AddEditMachineSidebar'
import { createNewMachine, deleteMachine, fetchAllMachines, updateMachine } from '@/redux/reducers/machineSlice'
import { fetchAllBranches } from '@/redux/reducers/branchSlice'
import { fetchInventoryDetails, fetchUnAssignedInventoryDetails } from '@/redux/reducers/inventoryDetailSlice'
import { toast } from 'react-hot-toast'
import DeleteMachineModal from '@/components/machine/DeleteMachineModal'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isDeleteMachineModalOpen, setIsDeleteMachineModalOpen] = useState(false);
  const allcustomers = useSelector((state) => state.machine)
  const allbranches = useSelector((state) => state.branch)
  const inventories = useSelector((state)=>state.inventory)
  console.log(inventories);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllMachines());
    };

    fetchData();
  }, [dispatch]);
  useEffect(() => {
    const fetchBranches = async () => {
      await dispatch(fetchAllBranches());
      await dispatch(fetchUnAssignedInventoryDetails());
    };
  
    fetchBranches();
  }, []);
  const mainTableColumns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'Sr. No',
        size: 150,
      },
      {
        accessorKey: 'machineId',
        header: 'Machine ID',
        size: 150,
      },
      {
        accessorKey: 'reseller.name',
        header: 'Reseller',
        size: 150,
      },
      {
        accessorKey: 'customer.name',
        header: 'Customer',
        size: 150,
      },
      {
        accessorKey: 'branch.name',
        header: 'Branch',
        size: 150,
      },
      {
        accessorKey: 'warrentyStart',
        header: 'Warranty Start Date',
        size: 150,
      },
      {
        accessorKey: 'warrentyExpire',
        header: 'Warranty Expire Date',
        size: 150,
      },
      {
        accessorKey: 'warrentystatus',
        header: 'Status',
        size: 150,
      },
    ],
    []
  );
  const handleOpenAddSidebar = () => {
    setSelectedMachine(null);
    setIsAddSidebarOpen(true);
  };
  const handleEditMachine = (machineData) => {
    setSelectedMachine(machineData);
    setIsAddSidebarOpen(true);
  };
  const handleDeleteMachine = (machineData) => {
    setSelectedMachine(machineData);
    setIsDeleteMachineModalOpen(true);
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditMachine(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteMachine(row.original)}>
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
        header: 'Machine Inventory',
        columns: [
          { header: 'Invoice', accessorKey: 'invoiceNo' },
          { header: 'Serial Number', accessorKey: 'serialNumber' },
          { header: 'Inventry Type', accessorKey: 'inventryType' },
          { header: 'Brand Name', accessorKey: 'brandName' },
          { header: 'Warranty Start Date', accessorKey: 'manufacturerwarrantyExpire' },
          { header: 'Reseller Warranty Start', accessorKey: 'resellerwarrantyExpire' },
        ],
        data: row?.original?.inventoryDetails,
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
          Add Machine
        </Button>
      </Box>
    );
  };
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
  const handleAddMachine = async (machineData) => {
    if (selectedMachine) {
      // Update existing customer
      const updatedData={
        id:selectedMachine._id,
        data:machineData
      }
      dispatch(updateMachine(updatedData)).unwrap().then(async()=>{
        await dispatch(fetchAllMachines())
        toast.success('Machine Updated Successfully')
     }).catch((error)=>{
       toast.error(error)
     })
      console.log('Updating customer', machineData);
    } else {
      // Add new customer
      // addCustomer(newcustomer.payload);
      dispatch(createNewMachine(machineData)).unwrap().then(async()=>{
        await dispatch(fetchAllMachines())
        toast.success('Machine Added Successfully')
     }).catch((error)=>{
       toast.error(error)
     })
      console.log('Add customer', machineData);
    }
    handleCloseAddSidebar();
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteMachineModalOpen(false);
  };
  const handleConfirmDeleteMachine = () => {
    dispatch(deleteMachine(selectedMachine)).unwrap()
      .then(() => {
        toast.success('Machine Delete Successfully')
        setIsDeleteMachineModalOpen(false);
      })
      .catch((error) => {
        toast.error(error)
        setIsDeleteMachineModalOpen(false);
        console.error('Error deleting customer:', error);
      });
  };
  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Machines
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
          <AddEditMachineSidebar
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddMachine}
            selectedMachine={selectedMachine}
            branches={allbranches}
            inventories={inventories}
          />
        )}
         <DeleteMachineModal
          isOpen={isDeleteMachineModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteMachine}
          title='Machine'
        />
      </>
    </Layout>
  )
}

export default index