import React, { FC } from 'react';
import './index.css';
import { StoreProvider } from './utils/store';
import Routes from './Routes';
import './i18n';
import { SecureStorageProvider } from './utils/storage';
import { Toaster } from 'react-hot-toast';
import { AccountProvider } from './utils/account';
import { DarkModeProvider } from './utils/darkMode';

interface AppProps {
  display: 'tab' | 'extension' | 'mobile';
}

const App: FC<AppProps> = ({ display }) => {
  return (
    <DarkModeProvider>
      <StoreProvider display={display}>
        <Toaster
          position={display === 'tab' ? 'bottom-right' : 'top-center'}
          reverseOrder
        />
        <SecureStorageProvider>
          <AccountProvider>
            <Routes />
          </AccountProvider>
        </SecureStorageProvider>
      </StoreProvider>
    </DarkModeProvider>
  );
};

export default App;
