import Link from 'next/link';
import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const NewSidebar = ({ isSidebarOpen, menuItems, setIsSidebarOpen }) => {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index, hasChildren) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((item) => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }

    // if (!hasChildren) {
    //   setIsSidebarOpen(false);
    // }
  };

  const renderMenuItems = (items, parentIndex = '', hasChildren = false) => {
    return (
      <ul>
        {items.map((item, index) => {
          const itemIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
          const isOpen = openItems.includes(itemIndex);

          return (
            <li key={index}>
              <div
                className="menu-item rounded-lg flex items-center justify-between py-2 px-4 text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer"
                onClick={() => toggleItem(itemIndex, item.children && item.children.length > 0)}
              >
                {item.url ? (
                  <Link href={item.url}>
                    <span className="flex justify-center items-center gap-2">
                      {item.icon}
                      {item.title}
                    </span>
                  </Link>
                ) : (
                  <span className="flex justify-center items-center gap-2">
                    {item.icon}
                    {item.title}
                  </span>
                )}
                {item.children && item.children.length > 0 && (
                  <FiChevronDown
                    className={`ml-2 transition-transform duration-300 transform ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                )}
              </div>
              {item.children && item.children.length > 0 && isOpen && renderMenuItems(item.children, itemIndex, true)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <aside
        className={`overflow-y-auto fixed top-0 left-0 w-64 h-full z-40 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transform transition duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 pt-24 pb-5">
          {renderMenuItems(menuItems)}
        </div>
      </aside>
    </>
  );
};

export default NewSidebar;
