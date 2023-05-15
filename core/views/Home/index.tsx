import React from 'react';
import { ActionTypes, useStore } from '../../utils/store';
import Avatar from '../../components/Avatar';
import AccountName from '../../components/AccountName';
import IconButton from '../../components/IconButton';
import { FaTrash } from 'react-icons/fa';
import { useSecureStorage } from '../../utils/storage';

const Home: React.FC = () => {
  const { state, dispatch } = useStore();
  const storage = useSecureStorage();
  return (
    <div>
      {state.addresses.map((address) => (
        <div className="flex space-x-4 items-center p-4">
          <Avatar content={address} />
          <AccountName address={address} />
          <IconButton
            IconComponent={FaTrash}
            name={'Delete'}
            onClick={async () =>
              storage.removeAccount(address).then(async () => {
                dispatch(ActionTypes.UPDATE_DATA, {
                  name: 'primaryAddress',
                  data: (await storage.getPrimaryAddress()) || null,
                });
                dispatch(ActionTypes.UPDATE_DATA, {
                  name: 'addresses',
                  data: (await storage.getAddresses()) || [],
                });
              })
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Home;
