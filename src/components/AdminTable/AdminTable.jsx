import React, { useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';

const AdminTable = ({ columns, data, handleAdminTableRowActions, handleNestedTable, handleToolBar }) => {
  return (
    <>
      <MaterialReactTable
       enableGrouping
        enableRowActions
        enableFilters
        enableColumnFilterModes
        enableColumnOrdering
        enablePinning
        enableClickToCopy
        positionActionsColumn="last"
        enableRowSelection
        columns={columns}
        data={data}
        renderRowActions={({ row, table }) => handleAdminTableRowActions(row, table)}
        renderDetailPanel={handleNestedTable && (({ row, table }) => handleNestedTable(row, table))}
        renderTopToolbarCustomActions={({ table }) => handleToolBar(table)}
      />
    </>
  );
};

export default AdminTable;











// import React, { useMemo, useState } from 'react';
// import { MaterialReactTable } from 'material-react-table';


// const AdminTable = ({ columns,data, handleAdminTableRowActions, handleNestedTable,handleToolBar }) => {
//   return (
//     <>
//       <MaterialReactTable
//         enableRowActions
//         enableFilters
//         enableColumnFilterModes
//         enableColumnOrdering
//         enablePinning
//         enableClickToCopy
//         positionActionsColumn="last"
//         enableRowSelection
//         columns={columns}
//         data={data}
//         renderRowActions={({ row, table }) => handleAdminTableRowActions(row, table)}
//         renderDetailPanel={({ row,table }) => handleNestedTable(row,table)}
//         renderTopToolbarCustomActions={({table})=>handleToolBar(table)}
//       />
//     </>)

// };

// export default AdminTable;
