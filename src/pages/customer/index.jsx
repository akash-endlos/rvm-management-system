"use client"
import AdminNestedTable from '@/components/AdminTable/AdminNestedTable'
import AdminTable from '@/components/AdminTable/AdminTable'
import SidebarLayout from '@/components/SidebarLayout/SidebarLayout'
import Layout from '@/layout/Layout'
import { fetchAllCustomers } from '@/redux/reducers/customerSlice'
import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, TableContainer, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const index = () => {
    const dispatch = useDispatch()
    const allcustomers = useSelector((state) => state?.customer?.Customer)
    // const [tableData, setTableData] = useState(() =>
    //     allcustomers?.map((customer, index) => ({
    //         ...customer,
    //         index: index + 1,
    //     }))
    // );
    const mainTableColumns = useMemo(
        () => [
            {
                accessorKey: 'index',
                header: 'Sr. No',
                size: 150,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
            },
        ],
        [],
    );
    useEffect(() => {
         dispatch(fetchAllCustomers());
      }, []);
      
 
    const handleActions = () => {
        return (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip arrow placement="left" title="Edit">
                    <IconButton>
                        <Edit />
                    </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                    <IconButton color="error" >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }


    const handleNestedTable = (row) => {
        const nestedTableConfigurations = [
            {
                header: 'branches',
                columns: [
                    { header: 'Name', accessorKey: 'name' },
                ],
                data: row?.original?.branches,
            },
            // {
            //   header: 'vendors',
            //   columns: [
            //     { header: 'Name', accessorKey: 'name' },
            //   ],
            //   data: row?.original?.vendors,
            // },
        ];
        return (
            <>
                {nestedTableConfigurations.map((config, index) => (
                    <>
                        <Typography variant="h5" style={{ fontWeight: 'bold', color: 'teal' }}>
                            {config?.header}
                        </Typography>
                        <AdminNestedTable columns={config?.columns} data={config?.data} />
                    </>
                ))}
            </>
        );
    };

    return (
        <Layout>
            <Typography variant="h4" style={{ fontWeight: 'bold', color: 'teal' }}>
                customers
            </Typography>
            {allcustomers && <AdminTable data={allcustomers} columns={mainTableColumns} handleActions={handleActions} handleNestedTable={handleNestedTable} />}
        </Layout>
    )
}


export default index