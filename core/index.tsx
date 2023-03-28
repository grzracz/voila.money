import React, { FC } from 'react';
import './index.css';
import { StoreProvider } from './store';
import Routes from './Routes';

interface AppProps {
  display: 'tab' | 'extension' | 'mobile';
}

const App: FC<AppProps> = ({ display }) => {
  return (
    <div style={{ minWidth: 320 }}>
      <StoreProvider display={display}>
        <Routes />
      </StoreProvider>
    </div>
  );
};

export default App;
