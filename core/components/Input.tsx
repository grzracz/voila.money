import React, { FC } from 'react';
import { IoClose } from 'react-icons/io5';

interface InputProps {
  value?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  className?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  onClear?: () => void;
  showClear?: boolean;
  disableMaxWidth?: boolean;
  replaceClear?: React.ReactNode;
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
  onClear,
  showClear,
  disableMaxWidth,
  replaceClear,
  noPadding,
  onFocus,
  disabled,
}) => {
  const handleKeyDown = (e) => {
    if (onEnter && e.key === 'Enter') onEnter();
  };

  return (
    <div
      className="flex px-2 sm:px-3 rounded-full w-full space-x-2 items-center relative"
      style={{
        maxWidth: disableMaxWidth ? '100%' : '16rem',
      }}
    >
      {icon && icon}
      <input
        className={
          'bg-transparent py-1 sm:py-2 w-full max-w-full overflow-hidden'
        }
        value={value}
        onChange={(event) => onChange(event.target.value || '')}
        placeholder={placeholder}
        type={type}
        onKeyDown={handleKeyDown}
        onFocus={onFocus as unknown as any}
        disabled={disabled}
      />
      {replaceClear
        ? replaceClear
        : (showClear !== undefined ? showClear : value !== '') && (
            <IoClose
              className="absolute right-2 sm:right-4 hover:opacity-80 transition-all cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                onChange('');
                if (onClear) onClear();
              }}
            />
          )}
    </div>
  );
};

export default Input;
