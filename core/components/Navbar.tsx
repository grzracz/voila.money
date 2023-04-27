import React from 'react';
import logoLight from '../assets/text-light.svg';
import logoDark from '../assets/text-dark.svg';
import Switch from './Switch';
import {
  IoLockClosed,
  IoMoon,
  IoOpenOutline,
  IoSettingsOutline,
  IoSunny,
} from 'react-icons/io5';

import { ActionTypes, useStore } from '../store';
import { Link, NavLink } from 'react-router-dom';
import IconButton from './IconButton';

const Navbar: React.FC = () => {
  const { state, dispatch } = useStore();
  const isDark = state.theme === 'dark';

  const toggleTheme = () => {
    dispatch(ActionTypes.TOGGLE_THEME);
  };

  const lock = () => {
    dispatch(ActionTypes.LOCK);
  };

  return (
    <nav className="top-0 left-0 right-0 z-10 relative transition-all p-2 md:p-4">
      <div className="container mx-auto px-2 md:px-4 flex items-center justify-between space-x-4">
        <div className="flex items-center min-w-max py-1 md:py-2">
          <Link to="/">
            <img
              className="h-6 md:h-8 w-auto select-none cursor-pointer"
              src={(isDark ? logoDark : logoLight) as unknown as string}
              alt={`Logo`}
            />
          </Link>
        </div>
        <div className="flex space-x-2 md:space-x-4 items-center">
          {state.display !== 'extension' ? (
            <>
              <Switch
                id={'toggle-theme'}
                name={'toggle-theme'}
                checked={isDark}
                onChange={toggleTheme}
                iconOff={<IoSunny size="0.8rem" />}
                iconOn={<IoMoon size="0.8rem" />}
              />
              {state.signedIn && (
                <>
                  <NavLink
                    title={`Settings`}
                    to={'/settings'}
                    className={({ isActive, isPending }) => {
                      const baseClasses =
                        'flex md:flex-col md:space-y-2 items-center p-3 space-x-3 md:space-x-0 md:w-full md:justify-center rounded-lg shadow-md';
                      const activeClasses =
                        'bg-blue-500 dark:bg-blue-600 text-white';
                      const inactiveClasses =
                        'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-800';
                      const pendingClasses = 'pending';

                      if (isPending) {
                        return `${baseClasses} ${pendingClasses}`;
                      }

                      return isActive
                        ? `${baseClasses} ${activeClasses}`
                        : `${baseClasses} ${inactiveClasses}`;
                    }}
                  >
                    <IoSettingsOutline size="1.2rem" />
                  </NavLink>
                  <IconButton
                    onClick={lock}
                    IconComponent={IoLockClosed}
                    name={`Lock screen`}
                  />
                </>
              )}
            </>
          ) : (
            <a href="/wallet.html" target="_blank" className="text-blue-400">
              <IoOpenOutline size="1.2rem" />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
