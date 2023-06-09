import { useLayoutEffect } from 'react';
import { getLocalState, useLocalState } from './useLocalState';

export const useDarkMode = () => {
  const darkClass = 'dark';

  const getInitialTheme = () => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const localPrefersDark = getLocalState(darkClass, undefined);
    return localPrefersDark !== undefined ? localPrefersDark : prefersDark;
  };

  const [isDark, setIsDark] = useLocalState<boolean | undefined>(
    darkClass,
    getInitialTheme()
  );

  useLayoutEffect(() => {
    document.body.classList.toggle('dark', getInitialTheme());
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prevIsDark) => {
      const newState = !prevIsDark;
      document.body.classList.toggle('dark', newState);
      return newState;
    });
  };

  return { isDark, toggleDarkMode };
};
