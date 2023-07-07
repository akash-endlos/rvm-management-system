import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from '@mui/material';

const EditableTable = ({ inventory }) => {
  const [data, setData] = useState(inventory);

  const handleChange = (e, index, field) => {
    const updatedData = [...data];
    updatedData[index][field] = e.target.value;
    setData(updatedData);
  };

  const handleAddRow = () => {
    setData([...data, { _inventry: '', warrantyStart: '', warrantyExpire: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  return (
    <TableContainer >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Inventry</TableCell>
            <TableCell>Warranty Start</TableCell>
            <TableCell>Warranty Expire</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={row._inventry}
                  onChange={(e) => handleChange(e, index, '_inventry')}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="date"
                  value={row.warrantyStart}
                  onChange={(e) => handleChange(e, index, 'warrantyStart')}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="date"
                  value={row.warrantyExpire}
                  onChange={(e) => handleChange(e, index, 'warrantyExpire')}
                />
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleRemoveRow(index)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" onClick={handleAddRow}>
        Add Row
      </Button>
    </TableContainer>
  );
};

export default EditableTable;
