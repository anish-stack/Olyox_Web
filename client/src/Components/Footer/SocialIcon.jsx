import React from 'react';

export const SocialIcon = ({ href, icon: Icon }) => {
  return (
    <a 
      href={href}
      target='_blank'
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
    >
      {Icon}
    </a>
  );
};