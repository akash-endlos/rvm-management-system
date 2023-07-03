import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';

const AdminNestedTable = ({ columns, data,heading }) => {

  return (
  <> 
    <MaterialReactTable columns={columns} data={data} />
  </>);
};

export default AdminNestedTable;
