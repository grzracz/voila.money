import React from 'react';

interface CardProps {
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, disabled, onClick, children }) => {
  return (
    <div
      title={title}
      onClick={onClick}
      className={
        'inline-flex transition-all flex-col p-2 md:p-4 items-start rounded-lg shadow-md dark:shadow-gray-700 hover:shadow-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60' +
        (!disabled && onClick ? ' cursor-pointer' : '')
      }
    >
      {children}
    </div>
  );
};

export default Card;
