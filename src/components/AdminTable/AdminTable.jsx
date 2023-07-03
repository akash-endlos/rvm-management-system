import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';


const AdminTable = ({ columns,data, handleActions, handleNestedTable }) => {

  return (
    <>
      <MaterialReactTable
        enableRowActions
        enableFilters
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        positionActionsColumn="last"
        enableRowSelection
        columns={columns}
        data={data}
        renderRowActions={({ row, table }) => handleActions(row, table)}
        renderDetailPanel={({ row }) => handleNestedTable(row)}
      />
    </>)

};

export default AdminTable;
