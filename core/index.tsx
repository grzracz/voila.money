import React, { FC } from 'react';
import './index.css';
import { StoreProvider } from './utils/store';
import Routes from './Routes';
import './i18n';
import { SecureStorageProvider } from './utils/storage';
import { Toaster } from 'react-hot-toast';

interface AppProps {
  display: 'tab' | 'extension' | 'mobile';
}

const App: FC<AppProps> = ({ display }) => {
  return (
    <StoreProvider display={display}>
      <Toaster
        position={display === 'tab' ? 'bottom-right' : 'top-center'}
        reverseOrder
      />
      <SecureStorageProvider>
        <Routes />
      </SecureStorageProvider>
    </StoreProvider>
  );
};

export default App;
