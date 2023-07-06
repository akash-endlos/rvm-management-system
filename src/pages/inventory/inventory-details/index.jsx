import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { createInventoryDetail, fetchInventoryDetails } from '@/redux/reducers/inventoryDetailSlice'
import { fetchAllRoles } from '@/redux/reducers/roleSlice'
import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography,Button } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { FiGitBranch } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { createNewInventoryBrand, deleteInventoryBrand, fetchAllInventoryBrands, fetchInventoryBrand, updateInventoryBrand } from '@/redux/reducers/inventoryBrandSlice'
import AddEditInventoryBrand from '@/components/inventory-type/AddEditInventoryBrand'
import AddEditInventoryBrandSidebar from '@/components/inventory-brand/AddEditInventoryBrandSidebar'
import DeleteBrandModal from '@/components/inventory-type/DeleteBrandModal'
import { toast } from 'react-hot-toast'
import AddEditInventoryDetailSidebar from '@/components/inventory-brand/AddEditInventoryDetailSidebar'
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [brands, setBrands] = useState([])
  const [selectedInventoryBrand, setSelectedInventoryBrand] = useState(null);
  const [isDeleteBrandModalOpen, setIsDeleteBrandModalOpen] = useState(false);
  const [isAddDetailSidebarOpen, setIsAddDetailSidebarOpen] = useState(false); // New state for AddEditDetailSidebar
  const [selectedDetail, setSelectedDetail] = useState(null); // New state for AddEditBranchSidebar
  const allinventoryBrands = useSelector((state) => state.inventoryBrand)
  console.log(allinventoryBrands);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
     const data = await dispatch(fetchAllInventoryBrands());
     setBrands(data.payload.payload.brands)
     console.log(data.payload.payload.brands);
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
    setSelectedInventoryBrand(null);
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
          Add Brand
        </Button>
      </Box>
    );
  };
  const handleEditBrand = (brandData) => {
    setSelectedInventoryBrand(brandData);
    setIsAddSidebarOpen(true);
  };
  const handleDeleteBrand = (brandData) => {
    setSelectedInventoryBrand(brandData);
    setIsDeleteBrandModalOpen(true);
  };
  const handleOpenAddDetailSidebar = (brandData) => {
    setSelectedDetail(null);
    setIsAddDetailSidebarOpen(true);
    setSelectedInventoryBrand(brandData);
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditBrand(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteBrand(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Add Branch">
          <IconButton color="secondary" onClick={() => handleOpenAddDetailSidebar(row.original)}>
            <FiGitBranch />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleEditDetail = (detailData) => {
    setSelectedDetail(detailData);
    setIsAddDetailSidebarOpen(true);
  };
  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditDetail(row.original)}>
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
        header: 'Inventory Details',
        columns: [
        {
          accessorKey: 'invoiceNo',
          header: 'Invoice',
          size: 150,
        },
        {
          accessorKey: 'serialNumber',
          header: 'Serial Number',
          size: 150,
        },
        {
          accessorKey: 'purchaseDate',
          header: 'Purchase Date',
          size: 150,
        },
        {
          accessorKey: 'warrantyExpired',
          header: 'Warranty Expired',
          size: 150,
        },],
        data: row?.original?.invetries,
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
  const handleAddBrand = async (brandData) => {
    if (selectedInventoryBrand) {
      // Update existing customer
      dispatch(updateInventoryBrand(brandData))
      await dispatch(fetchAllInventoryBrands())
      console.log('Updating customer', brandData);
    } else {
      await dispatch(createNewInventoryBrand(brandData))
      await dispatch(fetchAllInventoryBrands())
      console.log('Updating customer', brandData);
    }
    handleCloseAddSidebar();
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteBrandModalOpen(false);
  };
  const handleConfirmDeleteBrand =  async() => {
    try {
      await dispatch(deleteInventoryBrand(selectedInventoryBrand))
      await setIsDeleteBrandModalOpen(false);
      toast.success('Brand Delete Successfully')
    } catch (error) {
      
    }
    // dispatch(deleteInventoryBrand(selectedInventoryBrand))
    //   .then(async () => {
    //     toast.success('Brand Delete Successfully')
    //   await handleCloseDeleteModal()
    //   await dispatch(fetchAllInventoryBrands())
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting customer:', error);
    //   });
  };
  const handleCloseAddDetailSidebar = () => {
    setIsAddDetailSidebarOpen(false);
  };
  const handleAddDetail = async (detailData) => {
    if (selectedDetail) {
      console.log('Updating branch', detailData);
    } else {
      try {
        const newDetailData = {
          brandId: selectedInventoryBrand._id,
          inventryTypeId: selectedInventoryBrand.inventryTypeId,
          invoiceNo: detailData.invoiceNo,
          serialNumber:detailData.serialNumber,
          purchaseDate:detailData.purchaseDate,
          warrantyExpired:detailData.warrantyExpired,
        };
        console.log(newDetailData);
          await dispatch(createInventoryDetail(newDetailData))  
          await dispatch(fetchAllInventoryBrands())
      } catch (error) {
        console.log(error);
      }
      // console.log('Adding branch', newDetailData);
    }
    handleCloseAddDetailSidebar();
  };
  return (
    <Layout>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Inventory Brand
      </Typography>
      <>
        <AdminTable
          data={allinventoryBrands}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
          handleNestedTable={handleNestedTable}
        />
        {isAddSidebarOpen && (
          <AddEditInventoryBrandSidebar
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddBrand}
            selectedInventoryBrand={selectedInventoryBrand}
          />
        )}
        <DeleteBrandModal
          isOpen={isDeleteBrandModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteBrand}
          title='Brand'
        />
        {isAddDetailSidebarOpen && (
          <AddEditInventoryDetailSidebar
            onClose={handleCloseAddDetailSidebar}
            onSubmit={handleAddDetail}
            selectedDetail={selectedDetail}
            brands={brands}
            // selectedCustomer={selectedCustomer}
          />
        )}
        </>
    </Layout>
  )
}

export default index