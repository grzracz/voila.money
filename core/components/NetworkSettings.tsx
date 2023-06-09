import React, { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import IconButton from './IconButton';

import { NETWORKS, Network } from '../utils/network';
import Dropdown from './Dropdown';
import { classNames } from '../utils/common';

const NetworkSettings: React.FC = () => {
  const [network, setNetwork] = useState(NETWORKS.AlgorandMainnet);

  const NetworkIcon =
    (network: Network, showTestnet = true) =>
    () =>
      (
        <div className="flex items-center min-w-max space-x-2">
          <img
            src={network.token.svg as unknown as string}
            alt=""
            className="shadow-lg rounded-full"
            style={{ height: '1.2rem', width: '1.2rem' }}
          />
          {!network.isMainnet && showTestnet && (
            <FaExclamationTriangle
              size="1rem"
              style={{ height: '1rem', width: '1rem' }}
              className="inline"
              color="orange"
            />
          )}
        </div>
      );

  const updateNetwork = (id: string) => {
    setNetwork(NETWORKS[id]);
  };

  return (
    <Dropdown
      onSelect={updateNetwork}
      options={Object.keys(NETWORKS).map((network) => ({
        id: network,
        content: (
          <div className="flex space-x-2 items-center justify-between text-center dark:bg-white bg-black bg-opacity-5 dark:bg-opacity-5 rounded-lg p-2">
            <div className="flex space-x-2 items-center">
              {NetworkIcon(NETWORKS[network], false)()}
              <span className="font-bold">{NETWORKS[network].name}</span>
            </div>
            <div>
              <span
                className={classNames(
                  'font-semibold',
                  NETWORKS[network].isMainnet
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-orange-600 dark:text-orange-500'
                )}
              >
                {NETWORKS[network].isMainnet ? 'MainNet' : 'TestNet'}
              </span>
            </div>
          </div>
        ),
      }))}
    >
      <IconButton
        IconComponent={NetworkIcon(network)}
        name={network.description}
      />
    </Dropdown>
  );
};

export default NetworkSettings;
