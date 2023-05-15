import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import * as animationDark from '../../assets/logo-dark-animation.json';
import * as animationLight from '../../assets/logo-light-animation.json';
import { ActionTypes, useStore } from '../../utils/store';
import Input from '../../components/Input';
import IconButton from '../../components/IconButton';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt } from 'react-icons/fa';
import { useSecureStorage } from '../../utils/storage';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const storage = useSecureStorage();
  const { state, dispatch } = useStore();
  const [password, setPassword] = useState('');
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSet, setPasswordSet] = useState<boolean>();

  const login = async (checkPassword = true) => {
    setLoginDisabled(true);
    try {
      const valid = checkPassword
        ? await storage.verifyPassword(password)
        : true;
      if (valid) {
        if (!passwordSet) {
          await storage.setPassword(password);
        }
        dispatch(ActionTypes.UPDATE_DATA, {
          name: 'primaryAddress',
          data: (await storage.getPrimaryAddress()) || null,
        });
        dispatch(ActionTypes.UPDATE_DATA, {
          name: 'addresses',
          data: (await storage.getAddresses()) || [],
        });
        dispatch(ActionTypes.UPDATE_DATA, {
          name: 'signedIn',
          data: true,
        });
      } else {
        setLoginDisabled(false);
        toast.error(
          t('view.Login.PasswordMismatch', 'Password mismatch! Retry?')
        );
      }
    } catch (e) {
      setLoginDisabled(false);
      toast.error(
        t(
          'view.Login.SomethingWentWrong',
          'Something went wrong while trying to login.'
        )
      );
    }
  };

  useEffect(() => {
    async function checkPasswordSet() {
      const [isPasswordSet, isStorageAvailable] = await storage.isPasswordSet();
      if (isStorageAvailable) {
        login(false);
      } else {
        setPasswordSet(isPasswordSet);
      }
    }

    checkPasswordSet();
  }, []);

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
                loginDisabled ||
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
