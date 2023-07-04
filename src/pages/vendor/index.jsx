import Layout from '@/layout/Layout'
import React, { useEffect, useMemo } from 'react'
import {
  Typography,
  Box
} from '@mui/material';
import AdminTable from '@/components/AdminTable/AdminTable';
import { fetchAllVendors } from '@/redux/reducers/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable';

const index = () => {
  const allvendors = useSelector((state) => state.vendor)
  console.log(allvendors);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllVendors());
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
        accessorKey: 'email',
        header: 'Email',
        size: 150,
      },
    ],
    []
  );
  const handleToolBar = (table) => {
    const handleExportRows = (rows) => {
      csvExporter.generateCsv(rows.map((row) => row.original));
    };
    return (
      <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
        {/* <Button
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
        </Button> */}
      </Box>
    );
  };
  const handleAdminTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        {/* <Tooltip arrow placement="left" title="Edit Customer">
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
        </Tooltip> */}
      </Box>
    );
  };
  const handleAdminNestedTableRowActions = (row, table) => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        {/* <Tooltip arrow placement="left" title="Edit Customer">
          <IconButton onClick={() => handleEditBranch(row.original)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="right" title="Delete Customer">
          <IconButton color="error" onClick={() => handleDeleteBranch(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip> */}
      </Box>
    );
  };
  const handleNestedTable = (row) => {
    const nestedTableConfigurations = [
      {
        header: 'customers',
        columns: [{ header: 'Name', accessorKey: 'name' }],
        data: row?.original?.customers,
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
  return (
    <Layout>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
        Vendors
      </Typography>
      <AdminTable
          data={allvendors}
          handleToolBar={handleToolBar}
          columns={mainTableColumns}
          handleAdminTableRowActions={handleAdminTableRowActions}
          handleNestedTable={handleNestedTable}
        />
    </Layout>
  )
}

export default index