import { useEffect, useState } from 'react';

export const getLocalState = <T>(name: string, def: T) => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(name);
      return item ? (JSON.parse(item) as T) : def;
    }
  } catch (e) {
    // pass
  }
  return def;
};

type StateFunction<T> = (state: T) => T;

export const useLocalState = <T>(
  name: string,
  def: T
): [T, (v: T | StateFunction<T>) => void] => {
  const [state, setState] = useState<T>(getLocalState<T>(name, def));

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && state !== undefined) {
        localStorage.setItem(name, JSON.stringify(state));
      }
    } catch (e) {
      // pass
    }
  }, [state]);

  return [state, setState];
};
