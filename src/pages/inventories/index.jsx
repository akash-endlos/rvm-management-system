import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice';
import { createNewInventoryType, deleteInventoryType, fetchAllInventoryTypes, updateInventoryType } from '@/redux/reducers/inventoryTypeSlice';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
import AdminTable from '@/components/AdminTable/AdminTable';
import AddEditInventoryType from '@/components/inventories/AddEditInventoryType';
import { Delete, Edit } from '@mui/icons-material';
import { FiGitBranch } from 'react-icons/fi';
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable';
import { toast } from 'react-hot-toast';
import DeleteInventoryTypeModal from '@/components/inventories/DeleteInventoryType';
import AddEditInventoryBrand from '@/components/inventories/AddEditInventoryBrand';
import { createNewInventoryBrand, updateInventoryBrand } from '@/redux/reducers/inventoryBrandSlice';

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedInventoryType, setSelectedInventoryType] = useState(null);
  const [isDeleteInventoryTypeModalOpen, setIsDeleteInventoryTypeModalOpen] = useState(false);
  const [isAddInventoryBrandSidebarOpen, setIsAddInventoryBrandSidebarOpen] = useState(false);
  const [selectedInventoryBrand, setSelectedInventoryBrand] = useState(null);
  const allinventories = useSelector((state) => state.inventoryType)
  console.log(allinventories);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchAllInventoryTypes()).unwrap()
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
  const handleEditInventoryType = (inventoryTypeData) => {
    setSelectedInventoryType(inventoryTypeData);
    setIsAddSidebarOpen(true);
  };
  const handleDeleteInventoryType = (inventoryTypeData) => {
    setSelectedInventoryType(inventoryTypeData);
    setIsDeleteInventoryTypeModalOpen(true);
  };
  const handleOpenAddInventoryBrandSidebar = (inventoryTypeData) => {
    setSelectedInventoryBrand(null);
    setIsAddInventoryBrandSidebarOpen(true);
    setSelectedInventoryType(inventoryTypeData);
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditInventoryType(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteInventoryType(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Add Branch">
          <IconButton color="secondary" onClick={() => handleOpenAddInventoryBrandSidebar(row.original)}>
            <FiGitBranch />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleOpenAddSidebar = () => {
    setSelectedInventoryType(null);
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
          Add InventoryType
        </Button>
      </Box>
    );
  };
  const handleSubNestedTable = (row, table, currentDepth = 0, maxDepth = 1) => {
    const nestedTableConfigurations = [
      {
        header: 'Inventory Detail',
        columns: [{ header: 'Invoice', accessorKey: 'invoiceNo' }],
        data: currentDepth === 0 ? row?.original?.invetries : undefined,
      },
    ];
    return (
      <>
        {nestedTableConfigurations.map((config, index) => (
          <React.Fragment key={index}>
            <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
              {config?.header}
            </Typography>
            <AdminNestedTable
              handleSubNestedTable={handleSubNestedTable}
              handleAdminNestedTableRowActions={handleAdminNestedTableRowActions}
              columns={config?.columns}
              data={config?.data}
              currentDepth={currentDepth + 1}
              maxDepth={maxDepth}
            />
          </React.Fragment>
        ))}
      </>
    );
  };
  const handleNestedTable = (row) => {
    const nestedTableConfigurations = [
      {
        header: 'Inventory Brand',
        columns: [{ header: 'Name', accessorKey: 'name' }],
        data: row?.original?.invetrybrands,
      },
    ];
    return (
      <>
        {nestedTableConfigurations.map((config, index) => (
          <>
            <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
              {config?.header}
            </Typography>
            <AdminNestedTable handleSubNestedTable={handleSubNestedTable} handleAdminNestedTableRowActions={handleAdminNestedTableRowActions} columns={config?.columns} data={config?.data} />
          </>
        ))}
      </>
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
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
  const handleAddInventoryType = async (inventoryTypeData) => {
    if (selectedInventoryType) {
      // Update existing customer
      const updatedNewInventoryType = {
        id: selectedInventoryType._id,
        name: inventoryTypeData.name
      }
      dispatch(updateInventoryType(updatedNewInventoryType)).unwrap()
        .then(() => {
          dispatch(fetchAllInventoryTypes());
          toast.success('Updated Inventory Type Successfully');
        })
        .catch(error => {
          toast.error(error)
        });
      console.log('Updating customer', inventoryTypeData);
    } else {
      // Add new customer
      dispatch(createNewInventoryType(inventoryTypeData)).unwrap()
        .then(() => {
          toast.success('Added Inventory Type Successfully');
        })
        .catch(error => {
          toast.error(error)
        });

      console.log('Add InventoryType', inventoryTypeData);
      // addCustomer(newcustomer.payload);
    }
    handleCloseAddSidebar();
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteInventoryTypeModalOpen(false);
  };
  const handleConfirmDeleteInventoryType = () => {
    dispatch(deleteInventoryType(selectedInventoryType._id)).unwrap()
      .then(() => {
        setIsDeleteInventoryTypeModalOpen(false);
        toast.success('InventoryType Delete Successfully')
      })
      .catch((error) => {
        toast.error(error)
        setIsDeleteInventoryTypeModalOpen(false);
        console.error('Error deleting customer:', error);
      });
  };
  const handleCloseAddInventoryBrandSidebar = () => {
    setIsAddInventoryBrandSidebarOpen(false);
  };
  const handleAddInventoryBrand = async (inventoryBrand) => {
    if (selectedInventoryBrand) {
      // Update existing branch
      const updatedBrandData = {
        id: selectedInventoryType._id,
        name: inventoryBrand.branchName
      }
      dispatch(updateInventoryBrand(updatedBrandData)).unwrap()
        .then(async () => {
          await dispatch(fetchAllInventoryTypes());
          toast.success('Brand Updated Succcessfully')

        })
        .catch(error => {
          toast.error(error);
        });

      console.log('Updating branch', updatedBrandData);
    } else {
      console.log(selectedInventoryType);
      const newinventoryBrandData = {
        inventryTypeId: selectedInventoryType?._id,
        name: inventoryBrand?.branchName
      }
      dispatch(createNewInventoryBrand(newinventoryBrandData))
        .then(async () => {
          await dispatch(fetchAllInventoryTypes());
          toast.success('Brand Added Succcessfully')
        })
        .catch(error => {
          toast.error(error);
        });

    }
    handleCloseAddInventoryBrandSidebar();
  };
  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Inventory Type
      </Typography>
      <>
        <AdminTable
          data={allinventories}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
          handleNestedTable={handleNestedTable}
        />
        {isAddSidebarOpen && (
          <AddEditInventoryType
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddInventoryType}
            selectedInventoryType={selectedInventoryType}
          />
        )}
        <DeleteInventoryTypeModal
          isOpen={isDeleteInventoryTypeModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteInventoryType}
          title='Inventory Type'
        />
        {isAddInventoryBrandSidebarOpen && (
          <AddEditInventoryBrand
            onClose={handleCloseAddInventoryBrandSidebar}
            onSubmit={handleAddInventoryBrand}
            selectedInventoryBrand={selectedInventoryBrand}
          // selectedCustomer={selectedCustomer}
          />
        )}
      </>
    </Layout>
  )
}

export default index