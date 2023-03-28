import React, { FC } from 'react';
import Navbar from './components/Navbar';
import { HashRouter, Routes as BrowserRoutes, Route } from 'react-router-dom';
import Home from './views/Home';
import Settings from './views/Settings';

const Routes: FC = () => {
  return (
    <HashRouter>
      <Navbar />
      <BrowserRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </BrowserRoutes>
    </HashRouter>
  );
};

export default Routes;
