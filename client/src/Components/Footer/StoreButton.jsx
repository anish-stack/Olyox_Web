import React from 'react';

export const StoreButton = ({ href, icon: Icon, storeName, className = '' }) => {
  return (
    <a 
      href={href}
      className={`flex text-white items-center space-x-3 bg-gray-800 rounded-xl px-4 py-2 hover:bg-gray-700 transition-colors duration-300 ${className}`}
      target='_blank'
    >
      {Icon}
      <div>
        <div className="text-xs">Download on the</div>
        <div className="text-sm text-white font-semibold">{storeName}</div>
      </div>
    </a>
  );
};
