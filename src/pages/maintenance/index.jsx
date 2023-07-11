import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Delete, Edit } from '@mui/icons-material'
import { FiGitBranch } from 'react-icons/fi'
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable'
import { createNewProblem, deleteProblem, fetchAllProblems, updateProblem } from '@/redux/reducers/problemSlice'
import AddEditProblemSidebar from '@/components/problem/AddEditProblemSidebar'
import { toast } from 'react-hot-toast'
import DeleteProblemModal from '@/components/problem/DeleteProblemModal'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDeleteProblemModalOpen, setIsDeleteProblemModalOpen] = useState(false);
  const allproblems = useSelector((state) => state.problem)
  console.log(allproblems);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllProblems());
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
        accessorKey: 'problemType.name',
        header: 'Problem Type',
        size: 150,
        Cell: ({ renderedCellValue }) => {
          return(
            renderedCellValue
        )},
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 150,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 150,
      },
    ],
    []
  );
  const handleDeleteProblem = (problemData) => {
    setSelectedProblem(problemData);
    setIsDeleteProblemModalOpen(true);
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditProblem(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteProblem(row.original)}>
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
        header: 'Solutions',
        columns: [{ header: 'Name', accessorKey: 'name' }],
        data: row?.original?.solutions,
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
  const handleOpenAddSidebar = () => {
    setSelectedProblem(null);
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
          Add Problem
        </Button>
      </Box>
    );
  };
  const handleCloseAddSidebar = () => {
    setIsAddSidebarOpen(false);
  };
  const handleAddProblem = async (problemData) => {
    if (selectedProblem) {
      // Update existing customer
      const updatedProblemData={
        id:selectedProblem._id,
        data:problemData
      }
      dispatch(updateProblem(updatedProblemData))
      .unwrap()
      .then(() => {
        dispatch(fetchAllProblems())
        handleCloseAddSidebar();
        toast.success('Problem Updated Successfully');
      })
      .catch((error) => {
        // Handle the error here
        toast.error(error);
      });
      console.log('Updating customer', problemData);
    } else {
      // Add new customer
      // addCustomer(newcustomer.payload);
      dispatch(createNewProblem(problemData))
      .unwrap()
      .then(() => {
        dispatch(fetchAllProblems())
        handleCloseAddSidebar();
        toast.success('Problem Added Successfully');
      })
      .catch((error) => {
        // Handle the error here
        toast.error(error);
      });
      console.log('Add customer', problemData);
    }
    handleCloseAddSidebar();
  };
  const handleEditProblem = (problemData) => {
    setSelectedProblem(problemData);
    setIsAddSidebarOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteProblemModalOpen(false);
  };
  const handleConfirmDeleteProblem = () => {
    dispatch(deleteProblem(selectedProblem)).unwrap()
      .then(() => {
        toast.success('Problem Delete Successfully')
        setIsDeleteProblemModalOpen(false);
      })
      .catch((error) => {
        toast.error(error)
        setIsDeleteProblemModalOpen(false);
        console.error('Error deleting customer:', error);
      });
  };
  return (
    <Layout>
       <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Problems
      </Typography>
      <>
        <AdminTable
          data={allproblems}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
          handleNestedTable={handleNestedTable}
        />
         {isAddSidebarOpen && (
          <AddEditProblemSidebar
            onClose={handleCloseAddSidebar}
            onSubmit={handleAddProblem}
            selectedProblem={selectedProblem}
          />
        )}
         <DeleteProblemModal
          isOpen={isDeleteProblemModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteProblem}
          title='Problem'
        />
         </>
    </Layout>
  )
}

export default index