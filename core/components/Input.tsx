import React, { FC } from 'react';

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Input: FC<InputProps> = ({ value, onChange }) => {
  return <input></input>;
};

export default Input;
