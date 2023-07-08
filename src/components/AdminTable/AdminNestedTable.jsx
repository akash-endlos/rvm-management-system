import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

const AdminNestedTable = ({ columns, data, heading, handleSubAdminNestedTableRowActions, handleAdminNestedTableRowActions, handleSubNestedTable, currentDepth }) => {

  const renderDetailPanel = useMemo(() => {
    if (currentDepth === 1) {
      return undefined; // Do not render detail panel for the first level
    } else if (handleSubNestedTable) {
      return ({ row, table }) => handleSubNestedTable(row, table, currentDepth); // Pass currentDepth to nested handleSubNestedTable
    } else {
      return undefined;
    }
  }, [currentDepth, handleSubNestedTable]);

  return (
    <> 
      {data && (
        <MaterialReactTable
          enableRowActions
          enableFilters
          enableColumnFilterModes
          enableColumnOrdering
          enablePinning
          positionActionsColumn="last"
          renderDetailPanel={renderDetailPanel}
          renderRowActions={({ row, table }) => {
            if (currentDepth === 1) {
              return handleAdminNestedTableRowActions(row, table);
            } else {
              return handleSubAdminNestedTableRowActions(row, table);
            }
          }}
          columns={columns}
          data={data}
        />
      )}
    </>
  );
};

export default AdminNestedTable;
