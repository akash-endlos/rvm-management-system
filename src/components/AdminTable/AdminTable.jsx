import React, { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';


const AdminTable = ({ columns,data, handleActions, handleNestedTable }) => {
  const [tableData, setTableData] = useState(() =>
  data?.map((customer, index) => ({
      ...customer,
      index: index + 1,
  }))
);
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
        data={tableData}
        renderRowActions={({ row, table }) => handleActions(row, table)}
        renderDetailPanel={({ row }) => handleNestedTable(row)}
      />
    </>)

};

export default AdminTable;
