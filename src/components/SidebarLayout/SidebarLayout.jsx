import React, { useState } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import NewSidebar from './sidebar/NewSidebar';
import NewHeader from './header/NewHeader';
import SellIcon from '@mui/icons-material/Sell';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FactoryIcon from '@mui/icons-material/Factory';

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const menuItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Vendor',
      url: '/vendor',
      icon: <FactoryIcon />,
    },
    {
      title: 'Reseller',
      url: '/reseller',
      icon: <SellIcon />,
    },
    {
      title: 'Customer',
      url: '/customer',
      icon: <SupportAgentIcon />,
    },
    {
      title: 'User Management',
      url: '/user-management',
      icon: <PersonIcon />,
    },
    {
      title: 'Inventories',
      url: '/inventories',
      icon: <InventoryIcon />,
    },
    {
      title: 'Stock',
      url: '/stock',
      icon: <InventoryIcon />,
    },
    //  {
    //   title: 'Inventory',
    //   // url: '#',
    //   icon: <AiOutlineUserAdd />,
    //   children: [
    //     {
    //       title: 'Inventory Type',
    //       url: '/inventory/inventory-type',
    //       icon: <AiOutlineUserAdd />,
    //     },
    //     {
    //       title: 'Inventory Details',
    //       url: '/inventory/inventory-details',
    //       icon: <AiOutlineUserAdd />,
    //       // children: [
    //       //   {
    //       //     title: 'Sub Sub Item 1',
    //       //     url: '#',
    //       //     icon: <AiOutlineUserAdd />,
    //       //   },
    //       //   {
    //       //     title: 'Sub Sub Item 2',
    //       //     url: '#',
    //       //     icon: <AiOutlineUserAdd />,
    //       //   }
    //       // ]
    //     }
    //   ]
    // },
    
    {
      title: 'Machine',
      url: '/machine',
      icon: <PrecisionManufacturingIcon />,
    },
    {
      title: 'Maintenance',
      url: '/maintenance',
      icon: <EngineeringIcon />,
    },
    // {
    //   title: 'Ticket',
    //   url: '/ticket',
    //   icon: <AiOutlineUserAdd />,
    // },
    // {
    //   title: 'Item1',
    //   url: '#',
    //   icon: <AiOutlineUserAdd />,
    //   children: [
    //     {
    //       title: 'Sub Item 1',
    //       url: '#',
    //       icon: <AiOutlineUserAdd />,
    //     },
    //     {
    //       title: 'Sub Item 2',
    //       url: '#',
    //       icon: <AiOutlineUserAdd />,
    //       children: [
    //         {
    //           title: 'Sub Sub Item 1',
    //           url: '#',
    //           icon: <AiOutlineUserAdd />,
    //         },
    //         {
    //           title: 'Sub Sub Item 2',
    //           url: '#',
    //           icon: <AiOutlineUserAdd />,
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   title: 'Item 3',
    //   url: '#',
    //   icon: <AiOutlineUserAdd />,
    // }
  ];
  return (
    <>
      <NewHeader isSidebarOpen={isSidebarOpen} handleSidebarToggle={handleSidebarToggle} />
      <NewSidebar menuItems={menuItems} setIsSidebarOpen={setIsSidebarOpen} handleSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />
      <div className={`p-4 mt-4 ${isSidebarOpen ? 'ml-64':''}`}>
        <div className=" p-4 rounded-lg  mt-14">
          {children}
        </div>
      </div>
    </>

  )
}

export default SidebarLayout