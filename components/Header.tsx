import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-2xl mx-auto flex items-center justify-center py-6">
       <div className="flex items-center space-x-3">
         <LogoIcon />
         <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            AI LinkedIn Assistant
          </h1>
       </div>
    </header>
  );
};

export default Header;