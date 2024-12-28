import React from 'react';

export const FooterColumn = ({ title, children, className = '' }) => {
  return (
    <div className={className}>
      <h4 className="text-lg font-semibold mb-6 text-white">{title}</h4>
      {children}
    </div>
  );
};