import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

const AdminNestedTable = ({ columns, data,heading,handleAdminNestedTableRowActions,handleSubNestedTable,currentDepth }) => {

  return (
  <> 
    {data && <MaterialReactTable  enableRowActions
        enableFilters
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        positionActionsColumn="last"
        renderDetailPanel={currentDepth===1?undefined:({ row, table }) => handleSubNestedTable(row, table)}
        renderRowActions={({ row, table }) => handleAdminNestedTableRowActions(row, table)}
        columns={columns} data={data} />}
  </>);
};

export default AdminNestedTable;
