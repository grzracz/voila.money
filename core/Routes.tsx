import React, { FC } from 'react';
import './index.css';

interface RoutesProps {
  display: 'tab' | 'extension' | 'mobile';
}

const Routes: FC<RoutesProps> = ({ display }) => {
  return (
    <div className="text-4xl p-2">
      This is being displayed in {display}!{' '}
      <a href={'/wallet.html'} target="_blank">
        See wallet in tab.
      </a>
    </div>
  );
};

export default Routes;
