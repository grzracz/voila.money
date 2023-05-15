import algosdk from 'algosdk';
import React, { useEffect, useState } from 'react';
import Avatar from '../../../components/Avatar';
import AccountName from '../../../components/AccountName';
import IconButton from '../../../components/IconButton';
import { FaRedo, FaSave, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSecureStorage } from '../../../utils/storage';

const Create: React.FC = () => {
  const storage = useSecureStorage();
  const [account, setAccount] = useState<algosdk.Account>();

  const createAccount = () => {
    setAccount(algosdk.generateAccount());
  };

  const saveAccount = async () => {
    if (account) {
      try {
        await storage.addAccount(algosdk.secretKeyToMnemonic(account.sk));
        toast.success('Account saved!');
      } catch (e) {
        console.error(e);
        toast.error('Something went wrong while saving account');
      }
    }
  };

  useEffect(() => {
    createAccount();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-center md:text-left text-3xl md:text-5xl py-4">
        Create an <span className="blue">account</span>
      </h1>
      <div className="flex w-full items-center justify-center flex-col space-y-8 py-16">
        <div className="flex space-x-2 items-center">
          <Avatar content={account?.addr || ''} />
          <IconButton
            IconComponent={FaRedo}
            name="Recreate"
            onClick={createAccount}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="opacity-80">Public address:</span>
          <AccountName address={account?.addr || ''} className="text-xl" />
          <span className="opacity-80 pt-4">
            Your private key will be securely stored in a backup file
          </span>
        </div>
        <div className="p-4 flex space-x-2">
          <Link to={'/'}>
            <IconButton IconComponent={FaTimes} name="Cancel">
              <span>Cancel</span>
            </IconButton>
          </Link>
          <IconButton
            onClick={saveAccount}
            IconComponent={FaSave}
            name="Save"
            primary
          >
            <span>Save</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Create;
