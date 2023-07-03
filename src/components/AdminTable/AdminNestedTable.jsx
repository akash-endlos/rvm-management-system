import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

const AdminNestedTable = ({ columns, data,heading,handleAdminNestedTableRowActions }) => {

  return (
  <> 
    <MaterialReactTable  enableRowActions
        enableFilters
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        positionActionsColumn="last"
        enableRowSelection renderRowActions={({ row, table }) => handleAdminNestedTableRowActions(row, table)}
        columns={columns} data={data} />
  </>);
};

export default AdminNestedTable;
