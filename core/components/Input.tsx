import React, { FC, KeyboardEventHandler } from 'react';
import { FaTimes } from 'react-icons/fa';

interface InputProps {
  value?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  disableMaxWidth?: boolean;
  noPadding?: boolean;
  onFocus?: string;
  disabled?: boolean;
}

const Input: FC<InputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  icon,
  type,
  onEnter,
  disableMaxWidth,
  noPadding,
  onFocus,
  disabled,
}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (onEnter && event.key === 'Enter') onEnter();
  };

  return (
    <div
      className={`flex px-2 sm:px-3 rounded-full w-full space-x-2 items-center relative ${className}`}
      style={{
        maxWidth: disableMaxWidth ? '100%' : '16rem',
      }}
    >
      {icon && icon}
      <input
        className={`bg-transparent py-1 sm:py-2 w-full max-w-full overflow-hidden text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 rounded-full border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-600 transition-all ${
          noPadding ? '' : 'px-3'
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value || '')}
        placeholder={placeholder}
        type={type}
        onKeyDown={handleKeyDown as unknown as KeyboardEventHandler}
        onFocus={onFocus as unknown as any}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
