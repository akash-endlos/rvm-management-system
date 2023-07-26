import AdminTable from '@/components/AdminTable/AdminTable'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
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
import { createNewSolution, deleteSolution, fetchAllSolutions, updateSolution } from '@/redux/reducers/solutionSlice'
import AddEditSolutionSidebar from '@/components/problem/AddEditSolutionSidebar'
import DeleteSolutionModal from '@/components/problem/DeleteSolutionModal'

const index = () => {
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDeleteSolutionModalOpen, setIsDeleteSolutionModalOpen] = useState(false);
  const [isDeleteProblemModalOpen, setIsDeleteProblemModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isAddSolutionSidebarOpen, setIsAddSolutionSidebarOpen] = useState(false);
  const allproblems = useSelector((state) => state.problem)
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
          return (
            renderedCellValue
          )
        },
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
  const handleOpenAddSolutionSidebar = (solutionData) => {
    setSelectedSolution(null);
    setIsAddSolutionSidebarOpen(true);
    setSelectedProblem(solutionData);
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
          <IconButton color="secondary" onClick={() => handleOpenAddSolutionSidebar(row.original)}>
            <FiGitBranch />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };
  const handleEditSolution = (branchData) => {
    setSelectedSolution(branchData);
    setIsAddSolutionSidebarOpen(true);
  };
  const handleDeleteSolution = (branchData) => {
    setSelectedSolution(branchData);
    setIsDeleteSolutionModalOpen(true);
  };
  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditSolution(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteSolution(row.original)}>
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
        columns: [
          {
            header: 'solution',
            accessorKey: '_id',
            Cell: ({ row }) => {
              return (
                <>
                 
                    <><TableContainer >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{borderBottom:"none"}}>Step</TableCell>
                              <TableCell style={{borderBottom:"none"}}>Description</TableCell>
                              <TableCell style={{borderBottom:"none"}}>Image</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                          {row && row.original.solution.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell style={{borderBottom:"none"}}>{item.step}</TableCell>
                                <TableCell style={{borderBottom:"none"}}>{item.description}</TableCell>
                                <TableCell style={{borderBottom:"none"}}>  <img src={`https://storage.googleapis.com/rvmoperationadditionalbucket/rvmbackend/${item.image}`} style={{ width: "100px", height: "auto" }} alt="Step Image" /></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                </>
              )
            },
          },
        ],
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
      const updatedProblemData = {
        id: selectedProblem._id,
        data: problemData
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

  const handleCloseAddSolutionSidebar = () => {
    setIsAddSolutionSidebarOpen(false);
  };

  const handleAddBranch = async (addsolutionData) => {
    if (selectedSolution) {
      const updatedData = {
        _id: selectedSolution._id,
        data: addsolutionData
      }
      // Update existing branch
      dispatch(updateSolution(updatedData)).unwrap()
        .then(() => {
          dispatch(fetchAllProblems());
          toast.success('Added Solution Successfully');
        })
        .catch(error => {
          toast.error(error)
        });
      console.log('Updating branch', addsolutionData);
    } else {

      dispatch(createNewSolution(addsolutionData)).unwrap()
        .then(() => {
          dispatch(fetchAllProblems());
          toast.success('Added Solution Successfully');
        })
        .catch(error => {
          toast.error(error)
        });
      console.log('Adding branch', addsolutionData);
    }
    handleCloseAddSolutionSidebar();
  };
  const handleCloseDeleteSolutionModal = () => {
    setIsDeleteSolutionModalOpen(false)
  }

  const handleConfirmDeleteSolution = async () => {
    dispatch(deleteSolution(selectedSolution?._id)).unwrap()
      .then(async () => {
        await dispatch(fetchAllProblems());
        toast.success('Delete Solution Successfully');
      })
      .catch(error => {
        toast.error(error);
      });

    // Perform delete operation on selectedCustomer
    console.log('Deleting branch', selectedSolution);
    setIsDeleteSolutionModalOpen(false);
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
        {isAddSolutionSidebarOpen && (
          <AddEditSolutionSidebar
            onClose={handleCloseAddSolutionSidebar}
            onSubmit={handleAddBranch}
            selectedSolution={selectedSolution}
            selectedProblem={selectedProblem}
          // selectedCustomer={selectedCustomer}
          />
        )}
        <DeleteProblemModal
          isOpen={isDeleteProblemModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDeleteProblem}
          title='Problem'
        />
        <DeleteSolutionModal
          isOpen={isDeleteSolutionModalOpen}
          onClose={handleCloseDeleteSolutionModal}
          onDelete={handleConfirmDeleteSolution}
          title='Solution'
        />
      </>
    </Layout>
  )
}

export default index