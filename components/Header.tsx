
import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary dark:bg-gray-800 text-white shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-brand-accent" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Neighborhood Guardian
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
