import React, { FC } from 'react';
import './index.css';
import { StoreProvider } from './store';
import Routes from './Routes';

interface AppProps {
  display: 'tab' | 'extension' | 'mobile';
}

const App: FC<AppProps> = ({ display }) => {
  return (
    <StoreProvider display={display}>
      <Routes />
    </StoreProvider>
  );
};

export default App;
