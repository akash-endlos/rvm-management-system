import React, { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';


const AdminTable = ({ columns,data, handleAdminTableRowActions, handleNestedTable,handleToolBar }) => {
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
        renderRowActions={({ row, table }) => handleAdminTableRowActions(row, table)}
        renderDetailPanel={({ row }) => handleNestedTable(row)}
        renderTopToolbarCustomActions={({table})=>handleToolBar(table)}
      />
    </>)

};

export default AdminTable;
