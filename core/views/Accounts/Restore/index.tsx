import React, { useEffect, useState } from 'react';
import Input from '../../../components/Input';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '../../../components/IconButton';
import { FaChevronLeft, FaLock, FaUpload } from 'react-icons/fa';
import { t } from 'i18next';
import { useSecureStorage } from '../../../utils/storage';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { Buffer } from 'buffer';
import { ActionTypes, useStore } from '../../../utils/store';
import { classNames } from '../../../utils/common';

const Restore: React.FC = () => {
  const { dispatch, state } = useStore();
  const navigate = useNavigate();
  const storage = useSecureStorage();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    accept: {
      'text/plain': ['.bak'],
    },
  });
  const [password, setPassword] = useState('');
  const [backup, setBackup] = useState('');

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          if (e && e.target) {
            const content = ((e.target.result as string) || '').trim();
            JSON.parse(
              Buffer.from(content as string, 'base64').toString('utf8')
            );
            setBackup(content as string);
          }
        } catch (e) {
          toast.error(
            "Backup seems to be malformed. Are you sure it's the right file?"
          );
        }
      };
      reader.readAsText(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const importBackup = async () => {
    try {
      const currentAddresses = state.addresses;
      const [primaryAddress, addresses] = await storage.importBackup(
        backup,
        password
      );
      dispatch(ActionTypes.UPDATE_DATA, {
        name: 'primaryAddress',
        data: primaryAddress,
      });
      dispatch(ActionTypes.UPDATE_DATA, {
        name: 'addresses',
        data: addresses,
      });
      const amount = addresses.length - currentAddresses.length;
      toast.success(
        `Imported ${amount} additional ${
          amount === 1 ? 'account' : 'accounts'
        } from backup`
      );
      navigate('/');
    } catch (e) {
      toast.error(
        t(
          'view.Accounts.Backup.SomethingWentWrong',
          'Something went wrong while trying to restore backup: '
        ) + (e as Error)?.message
      );
    }
  };

  return (
    <div>
      <h1 className="font-bold text-center md:text-left text-3xl md:text-5xl py-4">
        Restore a <span className="blue">backup</span>
      </h1>
      <div className="flex w-full items-center justify-center flex-col space-y-8 py-16">
        <div
          {...getRootProps()}
          className={classNames(
            'bg-white border-2 border-dashed dark:bg-gray-800 rounded cursor-pointer flex items-center justify-center',
            backup ? 'border-green-400' : 'dark:border-gray-600'
          )}
          style={{ width: 400, height: 200 }}
        >
          <input {...getInputProps()} />
          {acceptedFiles.length > 0 ? (
            <p className="font-bold">{acceptedFiles[0].name}</p>
          ) : (
            <p className="opacity-50">
              Drop your file here or click to select one
            </p>
          )}
        </div>
        <div className="text-center text-md md:text-lg">
          <span className="font-light">
            Your private keys were encrypted with a password.
          </span>
          <br />
          <br />
          Please enter encryption password:
        </div>
        <div className="text-center flex space-x-2 items-center">
          <Input
            type="password"
            icon={<FaLock />}
            placeholder={t('view.Login.Password', 'Password') as string}
            value={password}
            onChange={setPassword}
            onEnter={importBackup}
          />
        </div>
        <div className="p-4 flex space-x-4">
          <Link to={'/accounts'}>
            <IconButton IconComponent={FaChevronLeft} name="Cancel">
              <span>Back</span>
            </IconButton>
          </Link>
          <IconButton
            onClick={importBackup}
            IconComponent={FaUpload}
            name="Import"
            disabled={password.trim() === '' || backup === ''}
            primary
          >
            <span>Restore backup</span>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Restore;
