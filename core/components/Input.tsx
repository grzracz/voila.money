import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputType?: 'text' | 'password' | 'email';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = React.memo(
  ({
    label,
    inputType = 'text',
    name,
    value,
    onChange,
    placeholder,
    prefix,
    suffix,
    icon,
    ...rest
  }) => {
    return (
      <div className="flex flex-col mb-4">
        <label
          htmlFor={name}
          className="mb-2 text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
        <div className="relative">
          {prefix && (
            <div className="absolute left-0 top-0 flex items-center h-full px-3 text-gray-600">
              {prefix}
            </div>
          )}
          {icon && (
            <div className="absolute left-0 top-0 flex items-center h-full px-3 text-gray-600">
              {icon}
            </div>
          )}
          <input
            type={inputType}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 ${
              prefix || icon ? 'pl-10' : ''
            } ${suffix ? 'pr-10' : ''}`}
            {...rest}
          />
          {suffix && (
            <div className="absolute right-0 top-0 flex items-center h-full px-3 text-gray-600">
              {suffix}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Input;
