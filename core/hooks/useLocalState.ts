import { useEffect, useState } from 'react';

export const getLocalState = <T>(name: string, def: T | undefined) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(name);
    return item ? (JSON.parse(item) as T) : def;
  }
  return def;
};

type StateFunction<T> = (state: T | undefined) => T | undefined;

export const useLocalState = <T>(
  name: string,
  def: T | undefined = undefined
): [T | undefined, (v: T | StateFunction<T>) => void] => {
  const [state, setState] = useState<T | undefined>(
    getLocalState<T>(name, def)
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && state !== undefined) {
      localStorage.setItem(name, JSON.stringify(state));
    }
  }, [state]);

  return [state, setState];
};
