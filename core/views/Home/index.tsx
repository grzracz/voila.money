import React from 'react';
import { useStore } from '../../utils/store';
import Avatar from '../../components/Avatar';
import AccountName from '../../components/AccountName';

const Home: React.FC = () => {
  const { state } = useStore();
  return (
    <div>
      {state.addresses.map((address) => (
        <div className="flex space-x-4 items-center p-4">
          <Avatar content={address} />
          <AccountName address={address} />
        </div>
      ))}
    </div>
  );
};

export default Home;
