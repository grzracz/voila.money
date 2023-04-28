import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import * as animationDark from '../../assets/logo-dark-animation.json';
import * as animationLight from '../../assets/logo-light-animation.json';
import { ActionTypes, useStore } from '../../store';
import Input from '../../components/Input';
import IconButton from '../../components/IconButton';
import { IoEnter } from 'react-icons/io5';
import { StorageKeys } from '../../../extension/src/scripts/storage';
import { SecureStorage } from '../../utils/storage';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt } from 'react-icons/fa';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSet, setPasswordSet] = useState<boolean>();

  async function checkPasswordSet() {
    setPasswordSet(await SecureStorage.isPasswordSet());
  }

  useEffect(() => {
    checkPasswordSet();
  }, []);

  const login = async () => {
    try {
      const valid = await SecureStorage.verifyPassword(password);
      if (valid) {
        if (!passwordSet) {
          await SecureStorage.setPassword(password);
        }
        dispatch(ActionTypes.UPDATE_DATA, {
          name: 'signedIn',
          data: true,
        });
        dispatch(ActionTypes.UPDATE_DATA, {
          name: 'primaryAddress',
          data:
            (await SecureStorage.get(StorageKeys.primaryAddress, password)) ||
            null,
        });
        dispatch(ActionTypes.UPDATE_DATA, {
          name: 'addresses',
          data:
            (await SecureStorage.get(StorageKeys.addresses, password)) || [],
        });
      } else {
        toast.error(
          t('view.Login.PasswordMismatch', 'Password mismatch! Retry?')
        );
      }
    } catch (e) {
      toast.error(
        t(
          'view.Login.SomethingWentWrong',
          'Something went wrong while trying to login.'
        )
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Lottie
        options={{
          loop: false,
          autoplay: true,
          animationData:
            state.theme === 'dark' ? animationDark : animationLight,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        height={state.display === 'tab' ? 400 : 240}
        width={state.display === 'tab' ? 400 : 240}
      />
      {passwordSet !== undefined && (
        <>
          <h1 className="text-2xl md:text-4xl font-bold">
            {passwordSet
              ? t('view.Login.WelcomeBack', 'Welcome back!')
              : t('view.Login.Welcome', 'Welcome!')}
          </h1>
          <h1 className="text-md md:text-lg font-light">
            {passwordSet
              ? t('view.Login.EnterPassword', 'Enter your password')
              : t(
                  'view.Login.SetupPassword',
                  'Set up your password - at least 8 characters'
                )}
          </h1>
          <div className="text-center pt-8 flex space-x-2 items-center">
            <Input
              type="password"
              placeholder={t('view.Login.Password', 'Password') as string}
              value={password}
              onChange={setPassword}
              showClear={false}
              onEnter={login}
            />
          </div>
          {!passwordSet && (
            <div className="text-center pt-4 flex space-x-2 items-center">
              <Input
                type="password"
                placeholder={
                  t('view.Login.ConfirmPassword', 'Confirm password') as string
                }
                value={confirmPassword}
                onChange={setConfirmPassword}
                showClear={false}
                onEnter={login}
              />
            </div>
          )}
          <div className="max-w-min pt-8">
            <IconButton
              IconComponent={FaSignInAlt}
              name={'Enter'}
              onClick={login}
              disabled={
                (!passwordSet && confirmPassword !== password) ||
                !password ||
                password.length < 8
              }
            >
              <span>{t('view.Login.Enter', 'Enter')}</span>
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
