import React, { useState } from 'react';
import {RxHamburgerMenu} from 'react-icons/rx'
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#FEFEFF] shadow-lg text-white py-6 px-10">
      <div className="container mx-auto flex items-center justify-between">
        <span className='lg:hidden md:flex'><RxHamburgerMenu size={25} className='text-gray-900  '/></span>
        <h1 className="text-4xl font-bold text-[#D0D2E0]"></h1>
        <div className="relative">
          <button
            className="flex items-center focus:outline-none"
            onClick={toggleMenu}
          >
            <img
              className="h-8 w-8 rounded-full"
              src="https://mui.com/static/images/avatar/3.jpg"
              alt="Avatar"
            />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                Settings
              </a>
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
