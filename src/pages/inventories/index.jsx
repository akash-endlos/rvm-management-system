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
import { Delete, Edit, Inventory } from '@mui/icons-material';
import { FiGitBranch } from 'react-icons/fi';
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable';
import { toast } from 'react-hot-toast';
import DeleteInventoryTypeModal from '@/components/inventories/DeleteInventoryType';
import AddEditInventoryBrand from '@/components/inventories/AddEditInventoryBrand';
import { createNewInventoryBrand, deleteInventoryBrand, updateInventoryBrand } from '@/redux/reducers/inventoryBrandSlice';
import DeleteInventoryBrandModal from '@/components/inventories/DeleteInventoryBrandModal';
import { createInventoryDetail, deleteInventoryDetail, updateInventoryDetail } from '@/redux/reducers/inventoryDetailSlice';
import AddEditInventorySidebar from '@/components/inventories/AddEditInventory';
import DeleteInventoryModal from '@/components/inventories/DeleteInventoryModal';
import { ExportToCsv } from 'export-to-csv';

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedInventoryType, setSelectedInventoryType] = useState(null);
  const [isDeleteInventoryTypeModalOpen, setIsDeleteInventoryTypeModalOpen] = useState(false);
  const [isAddInventoryBrandSidebarOpen, setIsAddInventoryBrandSidebarOpen] = useState(false);
  const [isAddInventorySidebarOpen, setIsAddInventorySidebarOpen] = useState(false);
  const [selectedInventoryBrand, setSelectedInventoryBrand] = useState(null);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isDeleteInventoryBrandModalOpen, setIsDeleteInventoryBrandModalOpen] = useState(false);
  const [isDeleteInventoryOpen, setIsDeleteInventoryOpen] = useState(false);
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
        <Tooltip arrow placement="left" title="Edit Type">
          <IconButton onClick={() => handleEditInventoryType(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Type">
          <IconButton color="error" onClick={() => handleDeleteInventoryType(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Add Brand">
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
        header: 'Product Detail',
        columns: [
          { header: 'Invoice', accessorKey: 'invoiceNo' },
          { header: 'Invoice Date', accessorKey: 'invoiceDate' },
          { header: 'Serial Number', accessorKey: 'serialNumber' },
          { header: 'Purchase Rate', accessorKey: 'purchaseRate' },
          { header: 'Warranty Start', accessorKey: 'warrantyStart' },
          { header: 'Purchase Date', accessorKey: 'purchaseDate' },
          { header: 'Warranty Expire', accessorKey: 'warrantyExpire' },
          { header: 'Status', accessorKey: 'status' },
          { header: 'Reseller Warranty Expire', accessorKey: 'resellerWarrantyExpire' },
          { header: 'Reseller Warranty Start', accessorKey: 'resellerWarrantyStart' },

        
        ],
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
        header: 'Product Brand',
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
            <AdminNestedTable handleSubAdminNestedTableRowActions={handleSubAdminNestedTableRowActions} handleSubNestedTable={handleSubNestedTable}  columns={config?.columns} data={config?.data} />
          </>
        ))}
      </>
    );
  };
  const handleDeleteInventoryBrand = (brandData) => {
    setSelectedInventoryBrand(brandData);
    setIsDeleteInventoryBrandModalOpen(true);
  };
  const handleEditInventoryBrand = (inventoryBrand) => {
    setSelectedInventoryBrand(inventoryBrand);
    setIsAddInventoryBrandSidebarOpen(true);
  };
  const handleEditInventory = (inventoryData) => {
    setSelectedInventory(inventoryData);
    setIsAddInventorySidebarOpen(true);
  };
  const handleDeleteInventory = (inventoryData) => {
    setSelectedInventory(inventoryData);
    setIsDeleteInventoryOpen(true);
  };
  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Inventory">
          <IconButton onClick={() => handleEditInventory(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Inventory">
          <IconButton color="error" onClick={() => handleDeleteInventory(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleOpenAddInventorySidebar = (brandData) => {
    setSelectedInventory(null);
    setIsAddInventorySidebarOpen(true);
    setSelectedInventoryBrand(brandData);
  };
  
  const handleSubAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Brand">
          <IconButton onClick={() => handleEditInventoryBrand(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Brand">
          <IconButton color="error" onClick={() => handleDeleteInventoryBrand(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        {/* <Tooltip arrow placement="right" title="Add Inventory">
          <IconButton color="teal" onClick={() => handleOpenAddInventorySidebar(row.original)}>
            <Inventory />
          </IconButton>
        </Tooltip> */}
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
  const handleCloseAddInventorySidebar = () => {
    setIsAddInventorySidebarOpen(false);
  };
  const handleAddInventoryBrand = async (inventoryBrand) => {
    if (selectedInventoryBrand) {
      // Update existing branch
      const updatedBrandData = {
        id: selectedInventoryBrand._id,
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
      dispatch(createNewInventoryBrand(newinventoryBrandData)).unwrap()
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
  const handleCloseDeleteInventoryBrandModal = () => {
    setIsDeleteInventoryBrandModalOpen(false)
  }
  const handleConfirmDeleteInvnetoryBrand = async () => {
    dispatch(deleteInventoryBrand(selectedInventoryBrand)).unwrap()
      .then(async () => {
        await dispatch(fetchAllInventoryTypes());
        toast.success('Delete Inventory Brand Successfully');
      })
      .catch(error => {
        toast.error(error);
      });

    // Perform delete operation on selectedCustomer
    setIsDeleteInventoryBrandModalOpen(false);
  };
  const handleAddInventory = async (inventoryData) => {
    const updatedData={
      inventryTypeId: '64a931e3fbfc29cf0a98c6a8',
      invoiceNo: inventoryData.invoiceNo,
      serialNumber: inventoryData.serialNumber,
      purchaseDate: inventoryData.purchaseDate,
      warrantyExpired: inventoryData.warrantyExpired,
      localVendorId:inventoryData.localVendorId,
      purchaseRate:inventoryData.purchaseRate,
      warrantyStart:inventoryData.warrantyStart,
      invoiceDate:inventoryData.invoiceDate,
    }
    if (selectedInventory) {
      const newUpdateDetailData = {
        id: selectedInventory._id,
        data:updatedData
      };
      dispatch(updateInventoryDetail(newUpdateDetailData)).unwrap()
      .then(async () => {
        await dispatch(fetchAllInventoryTypes());
        toast.success('Update Inventory Successfully')
      })
      .catch(error => {
        toast.error(error);
      });
    } else {
      const newDetailData = {
        invoiceDate:inventoryData.invoiceDate,
        brandId: selectedInventoryBrand._id,
        localVendorId:inventoryData.localVendorId,
        inventryTypeId: selectedInventoryBrand.inventryTypeId,
        invoiceNo: inventoryData.invoiceNo,
        serialNumber: inventoryData.serialNumbers,
        purchaseDate: inventoryData.purchaseDate,
        warrantyExpired: inventoryData.warrantyExpired,
        purchaseRate:inventoryData.purchaseRate,
        warrantyStart:inventoryData.warrantyStart
      };
      
      console.log(newDetailData);
      
      dispatch(createInventoryDetail(newDetailData)).unwrap()
        .then(async () => {
          await dispatch(fetchAllInventoryTypes());
          toast.success('Added Inventory Successfully')
        })
        .catch(error => {
          toast.error(error);
        });
      // console.log('Adding branch', newDetailData);
    }
    handleCloseAddInventorySidebar();
  };
  const handleCloseDeleteInventoryModal=()=>{
    setIsDeleteInventoryOpen(false)
  }
  const handleConfirmDeleteInventory = async () => {
    console.log(selectedInventory);
    dispatch(deleteInventoryDetail(selectedInventory?._id)).unwrap()
    .then(async () => {
      await dispatch(fetchAllInventoryTypes());
      toast.success('Delete Inventory Successfully');
    })
    .catch(error => {
      toast.error(error);
    });
    setIsDeleteInventoryOpen(false);
  };
  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Product Category(Type)
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
        <DeleteInventoryBrandModal
          isOpen={isDeleteInventoryBrandModalOpen}
          onClose={handleCloseDeleteInventoryBrandModal}
          onDelete={handleConfirmDeleteInvnetoryBrand}
          title='Inventory Brand'
        />
        {isAddInventorySidebarOpen && (
          <AddEditInventorySidebar
            onClose={handleCloseAddInventorySidebar}
            onSubmit={handleAddInventory}
            selectedInventory={selectedInventory}
          // selectedCustomer={selectedCustomer}
          />
        )}
           <DeleteInventoryModal
          isOpen={isDeleteInventoryOpen}
          onClose={handleCloseDeleteInventoryModal}
          onDelete={handleConfirmDeleteInventory}
          title='Inventory'
        />
      </>
    </Layout>
  )
}

export default index