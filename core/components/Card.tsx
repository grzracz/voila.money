import React from 'react';

interface CardProps {
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  disabled,
  onClick,
  children,
  className,
}) => {
  return (
    <div
      title={title}
      onClick={onClick}
      className={
        'inline-flex transition-all p-2 md:p-4 items-start rounded-lg shadow-md hover:shadow-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60' +
        (!disabled && onClick ? ' cursor-pointer' : '') +
        ` ${className || ''}`
      }
    >
      {children}
    </div>
  );
};

export default Card;
