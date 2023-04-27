import React from 'react';
import { IconType } from 'react-icons';

interface IconButtonProps {
  IconComponent: IconType;
  name: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  name,
  disabled,
  onClick,
  children,
}) => {
  return (
    <button
      title={name}
      disabled={disabled}
      onClick={onClick}
      className={
        'flex p-3 space-x-2 items-center rounded-lg shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      <IconComponent size="1.2rem" />
      {children}
    </button>
  );
};

export default IconButton;
