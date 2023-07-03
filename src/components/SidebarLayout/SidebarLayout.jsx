import React, { useState } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import NewSidebar from './sidebar/NewSidebar';
import NewHeader from './header/NewHeader';

const SidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const menuItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <AiOutlineUserAdd />,
    },
    // {
    //   title: 'Vendors',
    //   url: '/vendor',
    //   icon: <AiOutlineUserAdd />,
    // },
    {
      title: 'Customer',
      url: '/customer',
      icon: <AiOutlineUserAdd />,
    },
    
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
        <div className="border p-4 rounded-lg dark:border-gray-700 mt-14">
          {children}
        </div>
      </div>
    </>

  )
}

export default SidebarLayout