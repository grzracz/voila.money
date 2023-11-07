import React, { useState } from 'react';
import { classNames } from '../utils/common';
import { FaCopy } from 'react-icons/fa';

interface AccountNameProps {
  address?: string;
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
      navigator.clipboard.writeText(address || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={classNames(
        'cursor-pointer flex-col justify-center text-center',
        className
      )}
      onClick={copy}
    >
      <div className="opacity-50 text-sm overflow-auto">
        {full ?
            address
          :
            `${address?.slice(0, 4)}` + "..." + `${address?.slice(address.length - 4, address.length)}`
        }
      </div>
      <div
        className={classNames(
          'text-sm opacity-80 ',
          copied && 'pointer-events-none'
        )}
      >
        <div
          className={classNames(
            'text-xs pointer-events-none',
            copied ? 'opacity-80' : 'opacity-0'
          )}
        >
          Copied!
        </div>
      </div>
    </div>
  );
};

export default AccountName;
