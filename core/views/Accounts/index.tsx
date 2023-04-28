import React from 'react';
import Card from '../../components/Card';
import { NavLink } from 'react-router-dom';
import { FaHdd, FaKey, FaWallet } from 'react-icons/fa';

const Accounts: React.FC = () => {
  const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    url: string;
    description: string;
    disabled?: boolean;
  }> = ({ title, url, description, icon, disabled }) => (
    <NavLink
      title={title}
      to={url}
      className={disabled ? 'opacity-50 pointer-events-none' : undefined}
    >
      <Card
        className="max-w-[360px] flex flex-row items-center text-center md:text-left md:items-start md:flex-col"
        disabled={disabled}
      >
        <div className="text-2xl md:text-4xl px-2 md:p-0 md:pb-4 blue">
          {icon}
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">{title}</h3>
          <span className="px-2 md:px-0 md:text-sm font-light">
            {description}
          </span>
        </div>
      </Card>
    </NavLink>
  );

  return (
    <div>
      <h1 className="font-bold text-center md:text-left text-3xl md:text-5xl py-4">
        Add an <span className="blue">account</span>
      </h1>
      <div className="space-y-2 md:space-y-8 md:py-8">
        <div>
          <ActionCard
            icon={<FaWallet />}
            title="Create new"
            url="/accounts/create"
            description="Set up a fresh account to manage your assets securely"
          />
        </div>
        <div className="p-4 text-base md:text-lg text-center md:text-left text-gray-600 dark:text-gray-300">
          or
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
          <ActionCard
            icon={<FaKey />}
            title="Import mnemonic"
            url="/accounts/mnemonic"
            description="Restore an existing account using a mnemonic phrase"
          />
          <ActionCard
            icon={<FaHdd />}
            disabled
            title="Connect Ledger"
            url="/accounts/ledger"
            description="Connect your Ledger hardware wallet (coming soon)"
          />
        </div>
      </div>
    </div>
  );
};

export default Accounts;
