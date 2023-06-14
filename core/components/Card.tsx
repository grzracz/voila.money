import React from 'react';
import { classNames } from '../utils/common';

interface CardProps {
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disablePadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  disabled,
  onClick,
  children,
  className,
  disablePadding,
}) => {
  return (
    <div
      title={title}
      onClick={onClick}
      className={classNames(
        'inline-flex transition-all items-start rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60',
        !disabled && onClick && 'cursor-pointer',
        !disablePadding && 'p-2 md:p-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
