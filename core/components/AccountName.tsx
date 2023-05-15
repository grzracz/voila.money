import React, { useState } from 'react';
import { classNames } from '../utils/common';
import { FaCopy } from 'react-icons/fa';

interface AccountNameProps {
  address: string;
  full?: boolean;
  className?: string;
}

const AccountName: React.FC<AccountNameProps> = ({
  address,
  full,
  className,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = () => {
    try {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      title={address}
      className={classNames('flex space-x-2 items-center', className)}
    >
      <div className="flex items-center">
        <b>{address.slice(0, 4)}</b>
        <span className="opacity-80">{address.slice(4, 8)}</span>
        <span className="opacity-50">
          {full
            ? address.slice(8, 50)
            : `${address.slice(8, 12)}⋯${address.slice(46, 50)}`}
        </span>
        <span className="opacity-80">{address.slice(50, 54)}</span>
        <b>{address.slice(54)}</b>
      </div>
      <div
        className={classNames(
          'text-sm opacity-80 flex space-x-1 items-center relative',
          copied && 'pointer-events-none'
        )}
      >
        <FaCopy
          onClick={copy}
          className={classNames(
            'cursor-pointer hover:opacity-60',
            copied && 'opacity-20'
          )}
        />
        <span
          className={classNames(
            'pl-3 text-xs absolute pointer-events-none',
            copied ? 'opacity-80' : 'opacity-0'
          )}
        >
          Copied!
        </span>
      </div>
    </div>
  );
};

export default AccountName;
