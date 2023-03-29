import React, { createContext, useReducer, useContext } from 'react';
import { CryptoStorage } from '@webcrypto/storage';

interface State {
  display: 'tab' | 'extension' | 'mobile';
  theme: 'dark' | 'light';
  storage?: CryptoStorage;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  display: 'mobile',
  theme: 'light',
};

export const ActionTypes = {
  TOGGLE_THEME: 'TOGGLE_THEME',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.TOGGLE_THEME:
      const isDark = state.theme === 'dark';
      document.body.classList.toggle('dark', !isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      return { ...state, theme: isDark ? 'light' : 'dark' };
    default:
      return state;
  }
};

// Store context
const StoreContext = createContext<{
  state: State;
  dispatch: (type: string, payload?: any) => void;
}>({
  state: initialState,
  dispatch: () => {},
});

interface StoreProviderProps {
  children: React.ReactNode;
  display: 'tab' | 'extension' | 'mobile';
}

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = window.localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  }
  return 'light';
};

const initializeStore = (display: 'tab' | 'extension' | 'mobile'): State => {
  const theme = getInitialTheme();

  return {
    display,
    theme,
  };
};

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  display,
}) => {
  const initState = initializeStore(display);
  const [state, dispatchBase] = useReducer(reducer, initState);

  const dispatch = (type: string, payload?: any) => {
    dispatchBase({ type, payload });
  };

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
