import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AdminTable from '@/components/AdminTable/AdminTable';
import Layout from '@/layout/Layout';
import { addCustomer, createNewCustomer, deleteCustomer, fetchAllCustomers, fetchCustomer, setCustomers, updateCustomer } from '@/redux/reducers/customerSlice';
import { createNewInventoryType, deleteInventoryType, fetchAllInventoryTypes, updateInventoryType } from '@/redux/reducers/inventoryTypeSlice';
import AddEditInventoryType from '@/components/inventory-type/AddEditInventoryType';
import { Delete, Edit } from '@mui/icons-material';
import { FiGitBranch } from 'react-icons/fi';
import DeleteInventoryTypeModal from '@/components/inventory-type/DeleteInventoryTypeModal';
import { toast } from 'react-hot-toast';
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable';
import AddEditInventoryDetail from '@/components/inventory-type/AddEditInventoryBrand';
import { createNewInventoryDetail, updateInventoryDetail } from '@/redux/reducers/inventoryDetailSlice';
import AddEditInventoryBrand from '@/components/inventory-type/AddEditInventoryBrand';
import { createNewInventoryBrand, deleteInventoryBrand, updateInventoryBrand } from '@/redux/reducers/inventoryBrandSlice';
import DeleteBrandModal from '@/components/inventory-type/DeleteBrandModal';
import { ExportToCsv } from 'export-to-csv';


const Index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedInventoryType, setSelectedInventoryType] = useState(null);
  const [isDeleteInventoryTypeModalOpen, setIsDeleteInventoryTypeModalOpen] = useState(false);
  const [isDeleteInventoryBrandModalOpen, setIsDeleteInventoryBrandModalOpen] = useState(false);
  const [isAddInventoryDetailSidebarOpen, setIsAddInventoryDetailSidebarOpen] = useState(false);
  const [selectedInventoryDetail, setSelectedInventoryDetail] = useState(null);
  const allinventoryType = useSelector((state) => state.inventory)
  console.log(allinventoryType);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllInventoryTypes());
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
  const handleOpenAddSidebar = () => {
    setSelectedInventoryType(null);
    setIsAddSidebarOpen(true);
  };
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
          Add InventoryType
        </Button>
      </Box>
    );
  };
  const handleEditInventoryType = (inventoryData) => {
    setSelectedInventoryType(inventoryData);
    setIsAddSidebarOpen(true);
  };
  const handleOpenAddInventoryDetailSidebar = (customerData) => {
    setSelectedInventoryDetail(null);
    setIsAddInventoryDetailSidebarOpen(true);
    setSelectedInventoryType(customerData);
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
          <IconButton color="secondary" onClick={() => handleOpenAddInventoryDetailSidebar(row.original)}>
            <FiGitBranch />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleEditInventoryDetail = (brandData) => {
    setSelectedInventoryDetail(brandData);
    setIsAddInventoryDetailSidebarOpen(true);
  };
  const handleDeleteBranch = (branchData) => {
    setSelectedInventoryDetail(branchData);
    setIsDeleteInventoryBrandModalOpen(true);
  };
  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditInventoryDetail(row.original)}>
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
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteInventoryTypeModalOpen(false);
  };
  const handleAddInventoryType = async (inventoryTypeData) => {
    if (selectedInventoryType) {
      // Update existing customer
      const updatedNewInventoryType = {
        id: selectedInventoryType._id,
        name: inventoryTypeData.name
      }
      try {
        await dispatch(updateInventoryType(updatedNewInventoryType))
        await dispatch(fetchAllInventoryTypes())
        toast.success('Updated Inventory Type Successfully')
      } catch (error) {
        console.log(error);
      }
      console.log('Updating customer', inventoryTypeData);
    } else {
      // Add new customer
      try {
        await dispatch(createNewInventoryType(inventoryTypeData))
        toast.success('Added Inventory Type Successfully')
      } catch (error) {
        console.log(error);
      }
      console.log('Add InventoryType', inventoryTypeData);
      // addCustomer(newcustomer.payload);
    }
    handleCloseAddSidebar();
  };
  const handleDeleteInventoryType = (inventoryData) => {
    setSelectedInventoryType(inventoryData);
    setIsDeleteInventoryTypeModalOpen(true);
  };
  const handleConfirmDeleteInventoryType = () => {
    dispatch(deleteInventoryType(selectedInventoryType._id))
      .then(() => {
        handleCloseDeleteModal()
        toast.success('InventoryType Delete Successfully')
      })
      .catch((error) => {
        console.error('Error deleting customer:', error);
      });
  }
  const handleCloseAddInventoryDetailSidebar = () => {
    setIsAddInventoryDetailSidebarOpen(false);
  };
  const handleAddInventoryDetail = async (inventoryDetailData) => {
    if (selectedInventoryDetail) {
      // Update existing branch
      const updatedBrandData={
        id:selectedInventoryDetail._id,
        name:inventoryDetailData.branchName
      }
      dispatch(updateInventoryBrand(updatedBrandData))
      await dispatch(fetchAllInventoryTypes())
      console.log('Updating branch', updatedBrandData);
    } else {
      const newinventoryBrandData = {
        inventryTypeId: selectedInventoryType?._id,
        name: inventoryDetailData?.branchName
      }
      await dispatch(createNewInventoryBrand(newinventoryBrandData))
      await dispatch(fetchAllInventoryTypes())
    }
    handleCloseAddInventoryDetailSidebar();
  };
  const handleCloseDeleteBrandModal=()=>{
    setIsDeleteInventoryBrandModalOpen(false)
  }
  const handleConfirmDeleteBrand = async () => {
    try {
      await dispatch(deleteInventoryBrand(selectedInventoryDetail))
      await dispatch(fetchAllInventoryTypes())
      toast.success('Delete Brand SuccessFully')
    } catch (error) {
      console.log(error);
    }
    // Perform delete operation on selectedCustomer
    console.log('Deleting branch', selectedInventoryDetail);
    handleCloseDeleteBrandModal();
  };
  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Inventory Type
      </Typography>
      <>
        <AdminTable
          data={allinventoryType}
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
        {isAddInventoryDetailSidebarOpen && (
          <AddEditInventoryBrand
            onClose={handleCloseAddInventoryDetailSidebar}
            onSubmit={handleAddInventoryDetail}
            selectedInventoryDetail={selectedInventoryDetail}
          // selectedCustomer={selectedCustomer}
          />
        )}
        <DeleteInventoryTypeModal
          isOpen={isDeleteInventoryTypeModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteInventoryType}
          title='Inventory Type'
        />
         <DeleteBrandModal
          isOpen={isDeleteInventoryBrandModalOpen}
          onClose={handleCloseDeleteBrandModal}
          onDelete={handleConfirmDeleteBrand}
          title='Brand'
        />
      </>
    </Layout>
  );
};

export default Index;
