import React, { createContext, useContext, useLayoutEffect } from 'react';
import { getLocalState, useLocalState } from '../hooks/useLocalState';

interface DarkModeContextValue {
  isDark: boolean;
  toggleDarkMode: () => void;
}
const DarkModeContext = createContext<DarkModeContextValue | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: JSX.Element;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const darkClass = 'dark';

  const getInitialTheme = () => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const localPrefersDark = getLocalState(darkClass, undefined);
    return localPrefersDark !== undefined ? localPrefersDark : prefersDark;
  };

  const [isDark, setIsDark] = useLocalState<boolean>(
    darkClass,
    getInitialTheme()
  );

  useLayoutEffect(() => {
    document.body.classList.toggle(darkClass, isDark);
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((d) => !d);
  };

  return (
    <DarkModeContext.Provider value={{ isDark: !!isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useAccount must be used within a DarkModeProvider');
  }
  return context;
};
