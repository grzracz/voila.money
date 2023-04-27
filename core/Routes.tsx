import React, { FC } from 'react';
import Navbar from './components/Navbar';
import { HashRouter, Routes as BrowserRoutes, Route } from 'react-router-dom';
import Home from './views/Home';
import Settings from './views/Settings';
import Sidebar from './components/Sidebar';
import NFTs from './views/NFTs';
import Explore from './views/Explore';
import Activity from './views/Activity';
import { useStore } from './store';
import Login from './views/Login';
import { Toaster } from 'react-hot-toast';

const Routes: FC = () => {
  const { state } = useStore();

  return (
    <HashRouter>
      <div
        className="min-w-[320px] flex flex-col"
        style={{ minHeight: 'clamp(568px, 100vh, 100vh)' }}
      >
        <Toaster
          position={state.display === 'tab' ? 'bottom-right' : 'top-center'}
          reverseOrder
        />
        <Navbar />
        {state.signedIn ? (
          <div className="flex-grow flex">
            <Sidebar />
            <div className="p-2 md:p-4">
              <BrowserRoutes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/nfts" element={<NFTs />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/activity" element={<Activity />} />
              </BrowserRoutes>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </HashRouter>
  );
};

export default Routes;
