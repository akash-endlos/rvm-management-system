import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { Divider } from '@mui/material';

const Sidebar = ({ menuItems }) => {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((item) => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const renderMenuItems = (items, parentIndex = '') => {
    return (
      <ul>
        {items.map((item, index) => {
          const itemIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
          const isOpen = openItems.includes(itemIndex);

          return (
            <li key={index}>
              <div
                className="menu-item flex items-center justify-between py-2 px-4 text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => toggleItem(itemIndex)}
              >
                {item.url ? (
                  <Link href={item.url}>
                    <span className='flex justify-center items-center gap-2'>
                      {item.icon}
                      {item.title}
                    </span>
                  </Link>
                ) : (
                  <span className='flex justify-center items-center gap-2'>
                    {item.icon}
                    {item.title}
                  </span>
                )}
                {item.children && item.children.length > 0 && (
                  <FiChevronDown
                    className={`ml-2 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                  />
                )}
              </div>
              {item.children && item.children.length > 0 && isOpen && renderMenuItems(item.children, itemIndex)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-[#11192A] h-screen w-64 overflow-y-auto">
      <div className="p-5">
        <h1 className="text-white text-4xl text-center font-bold pb-6">Endlos</h1>
        <hr />
      </div>
      <nav className="mt-6">
        {renderMenuItems(menuItems)}
      </nav>
    </div>
  );
};

export default Sidebar;
