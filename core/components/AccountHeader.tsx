import React from 'react';
import { ActionTypes, useStore } from '../utils/store';
import { useSecureStorage } from '../utils/storage';
import Avatar from './Avatar';
import IconButton from './IconButton';
import { FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../utils/common';
import toast from 'react-hot-toast';

const AccountHeader: React.FC = () => {
  const storage = useSecureStorage();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();

  const updatePrimaryAddress = (address: string) => async () => {
    try {
      await storage.setPrimaryAddress(address);
      dispatch(ActionTypes.UPDATE_DATA, {
        name: 'primaryAddress',
        data: (await storage.getPrimaryAddress()) || null,
      });
    } catch (e) {
      toast.error('Something went wrong while setting primary address: ' + e);
    }
  };

  return (
    <div className="flex w-full relative justify-center">
      <div className="absolute max-w-screen-2xl flex w-full justify-end items-center space-x-4">
        <IconButton
          IconComponent={FaPlusCircle}
          name="Add account"
          onClick={() => navigate('/accounts')}
        />
        {state.addresses.map((address) => (
          <div
            key={`ava-${address}`}
            onClick={updatePrimaryAddress(address)}
            className={`transition-all cursor-pointer ${
              state.primaryAddress === address
                ? 'max-w-[80px] max-h-[80px]'
                : 'max-w-[42px] max-h-[42px] hover:max-w-[64px] hover:max-h-[64px]'
            }`}
          >
            <Avatar content={address} className={'min-w-max min-h-max'} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountHeader;
