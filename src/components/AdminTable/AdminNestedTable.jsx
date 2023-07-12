import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

const AdminNestedTable = ({ columns, data, heading, handleSubAdminNestedTableRowActions=false, handleAdminNestedTableRowActions, handleSubNestedTable, currentDepth }) => {

  const renderDetailPanel = useMemo(() => {
    if (currentDepth === 1) {
      return undefined; // Do not render detail panel for the first level
    } else if (handleSubNestedTable) {
      return ({ row, table }) => handleSubNestedTable(row, table, currentDepth); // Pass currentDepth to nested handleSubNestedTable
    } else {
      return undefined;
    }
  }, [currentDepth, handleSubNestedTable]);

  const renderRowActions = ({ row, table }) => {
    if (currentDepth === 1) {
      return handleAdminNestedTableRowActions(row, table);
    } else {
      return handleSubAdminNestedTableRowActions ? handleSubAdminNestedTableRowActions(row, table) : handleAdminNestedTableRowActions(row, table);
    }
  };

  return (
    <> 
      {data && (
        <MaterialReactTable
        enableGrouping
          enableRowActions
          enableFilters
          enableColumnFilterModes
          enableColumnOrdering
          enablePinning
          positionActionsColumn="last"
          renderDetailPanel={renderDetailPanel}
          renderRowActions={renderRowActions}
          columns={columns}
          data={data}
        />
      )}
    </>
  );
};

export default AdminNestedTable;
