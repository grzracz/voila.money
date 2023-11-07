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
        'cursor-pointer flex-col flex-wrap justify-center',
        className
      )}
      onClick={copy}
    >
      <div className="opacity-50 text-sm overflow-auto">
        {full ?
            address
          :
            `${address?.slice(0, 4)}` + "..." + `${address?.slice(46, 50)}`
        }
      </div>
      <div
        className={classNames(
          'text-sm opacity-80 flex-row justify-center',
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
