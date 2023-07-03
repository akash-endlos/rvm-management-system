import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Button, Menu, MenuItem, Avatar, Typography, Box } from '@mui/material';
import {RxCross1} from 'react-icons/rx'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/reducers/authSlice';
import { useRouter } from 'next/router';

const NewHeader = ({ handleSidebarToggle,isSidebarOpen }) => {
    const user = useSelector((state)=>state?.auth?.user?.user)
    const dispatch = useDispatch()
    const router = useRouter()
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout=()=>{
        router.push('/')
        dispatch(logout(null))
        handleClose()
    }
    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 ">
            <div className="px-3  lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className='flex items-center'>
                    {isSidebarOpen ? <RxCross1
                            className="cursor-pointer"
                            size={25}
                            onClick={handleSidebarToggle}
                        />:<GiHamburgerMenu    
                        className="cursor-pointer"
                        size={25}
                        onClick={handleSidebarToggle}
                    />}
                    <img src="/1080.png"  className="h-20 ml-3" alt="Endlos" />
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
                            <div>
                                <Button onClick={handleClick} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 27, height: 27 }} src="https://mui.com/static/images/avatar/3.jpg" alt="Avatar" />
                                    <Box ml={1}>
                                        <Typography variant="body2" style={{ fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                                            {user?.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{ fontSize: '0.7rem', marginLeft: '0.2rem', color: 'gray' }}
                                        >
                                            ({user?.role})
                                        </Typography>
                                    </Box>
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    className='mt-4'
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>Settings</MenuItem>
                                    <MenuItem onClick={()=>handleLogout()}>Logout</MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex items-center justify-start">
                       
                            <img src="/1080.png"  className="h-8 ml-3" alt="Endlos" />
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ml-3">
                            <div>
                                <Button onClick={handleClick} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 27, height: 27 }} src="https://mui.com/static/images/avatar/3.jpg" alt="Avatar" />
                                    <Box ml={1}>
                                        <Typography variant="body2" style={{ fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                                            {user.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            style={{ fontSize: '0.7rem', marginLeft: '0.2rem', color: 'gray' }}
                                        >
                                            ({user.role})
                                        </Typography>
                                    </Box>
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    className='mt-4'
                                >
                                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                                    <MenuItem onClick={handleClose}>Settings</MenuItem>
                                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </nav>
    );
};

export default NewHeader;
