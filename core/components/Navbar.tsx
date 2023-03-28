import React from 'react';
import logoLight from '../assets/logo-light.svg';
import logoDark from '../assets/logo-dark.svg';
import Switch from './Switch';
import {
  IoMoon,
  IoOpenOutline,
  IoSettingsOutline,
  IoSunny,
} from 'react-icons/io5';
import { ActionTypes, useStore } from '../store';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { state, dispatch } = useStore();
  const isDark = state.theme === 'dark';

  const toggleTheme = () => {
    dispatch(ActionTypes.TOGGLE_THEME);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 p-4">
      <div className="container mx-auto px-2 md:px-4 flex items-center justify-between space-x-4">
        <div className="flex items-center min-w-max">
          <Link to="/">
            <img
              className="h-6 md:h-8 w-auto select-none cursor-pointer"
              src={(isDark ? logoDark : logoLight) as unknown as string}
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex space-x-2 items-center">
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
              <Link to="/settings">
                <IoSettingsOutline size="1.2rem" />
              </Link>
            </>
          ) : (
            <a href="/wallet.html" target="_blank">
              <IoOpenOutline size="1.2rem" />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
