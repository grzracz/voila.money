import React from 'react';
import { IconType } from 'react-icons';
import { classNames } from '../utils/common';

interface SmallButtonProps {
  IconComponent?: IconType;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SmallButton: React.FC<SmallButtonProps> = ({
  IconComponent,
  disabled,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'flex items-center bg-white dark:bg-gray-800 shadow rounded px-2 py-1 hover:opacity-50',
        IconComponent && 'space-x-2',
        disabled && 'opacity-50 pointer-events-none'
      )}
    >
      {IconComponent && <IconComponent />}
      <span className="text-xs opacity-80">{children}</span>
    </button>
  );
};

export default SmallButton;
