import React from 'react';
import { Link } from 'react-router-dom';

export const FooterLink = ({ href = '#', children }) => {
  return (
    <Link
      to={href}
      className="text-gray-400 hover:text-white transition-colors duration-300 block mb-3"
    >
      {children}
    </Link>
  );
};