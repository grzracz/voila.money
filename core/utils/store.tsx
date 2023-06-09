import React, { createContext, useReducer, useContext } from 'react';
import { NETWORKS, Network } from './network';

interface State {
  display: 'tab' | 'extension' | 'mobile';
  signedIn: boolean;
  lockWarning: boolean;
  primaryAddress?: string;
  addresses: string[];
  network: Network;
  language: string;
}

export interface Action {
  type: string;
  payload?: any;
}

const initialState: State = {
  display: 'mobile',
  network: NETWORKS.AlgorandMainnet,
  language: 'en',
  signedIn: false,
  lockWarning: false,
  addresses: [],
};

export const ActionTypes = {
  TOGGLE_THEME: 'TOGGLE_THEME',
  UPDATE_DATA: 'UPDATE_DATA',
  LOCK: 'LOCK',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.UPDATE_DATA:
      return { ...state, [action.payload?.name]: action.payload?.data };
    case ActionTypes.LOCK:
      return initializeStore(state.display);
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

const initializeStore = (display: 'tab' | 'extension' | 'mobile'): State => {
  return {
    ...initialState,
    network:
      NETWORKS[window.localStorage.getItem('network') || 'AlgorandMainnet'],
    display,
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
