import React, { useEffect, useState } from 'react';
import Card from './Card';

interface Option {
  id: string;
  content: React.ReactNode | string;
}

interface DropdownProps {
  children?: React.ReactNode;
  options: Option[];
  onSelect: (id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ children, options, onSelect }) => {
  const [open, setOpen] = useState(false);

  const closeDropdown = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) window.addEventListener('click', closeDropdown);
    else window.removeEventListener('click', closeDropdown);
  }, [open]);

  const updateSelect = (id: string) => () => {
    if (onSelect) onSelect(id);
    closeDropdown();
  };

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
        setOpen((o) => !o);
      }}
    >
      {children}
      {open && (
        <div
          className="z-10 absolute right-0 pt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Card disablePadding className="p-2">
            <ul className="space-y-1">
              {options.map((option) => (
                <li
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={updateSelect(option.id)}
                >
                  {option.content}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
