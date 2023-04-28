import React from 'react';
import Card from '../../components/Card';
import { NavLink } from 'react-router-dom';

const Accounts: React.FC = () => {
  return (
    <div>
      <h1 className="font-bold text-5xl py-4">Add an account</h1>
      <div className="space-x-4 py-8">
        <NavLink title="Create new account" to={'/accounts/create'}>
          <Card>Create new</Card>
        </NavLink>
        <NavLink title="Create new account" to={'/accounts/mnemonic'}>
          <Card>From mnemonic</Card>
        </NavLink>
      </div>
    </div>
  );
};

export default Accounts;
