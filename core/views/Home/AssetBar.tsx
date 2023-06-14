import React, { useMemo } from 'react';
import { AssetParams } from '../../utils/account';
import Amount from '../../components/Amount';
import IconButton from '../../components/IconButton';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';
import assetPlaceholder from '../../assets/asset.png';
import Card from '../../components/Card';
import { classNames } from '../../utils/common';
import { Link } from 'react-router-dom';
import { Network } from '../../utils/network';

interface AssetBarProps {
  id: number;
  amount: number;
  assets: Record<number, AssetParams>;
  network?: Network;
}

const AssetBar: React.FC<AssetBarProps> = ({ id, amount, assets, network }) => {
  const [name, ticker, decimals] = useMemo(() => {
    if (network)
      return [network.token.name, network.token.ticker, network.token.decimals];
    else {
      const asset: AssetParams | undefined = assets[id];
      let name = '';
      let ticker = '';
      try {
        name = window.atob(asset?.['name-b64']);
        ticker = window.atob(asset?.['unit-name-b64']);
      } catch {
        // pass
      }
      return [
        asset?.name || name,
        asset?.['unit-name'] || ticker,
        asset?.decimals || 0,
      ];
    }
  }, [id, assets, network]);

  return (
    <Card
      className={classNames(
        'w-full items-center flex justify-between',
        !network && amount === 0 && 'opacity-50 hover:opacity-100'
      )}
    >
      <div className="flex items-center space-x-2">
        {network ? (
          <div className="min-w-max px-2">
            <img
              src={network.token.svg as unknown as string}
              alt=""
              className={classNames(
                'shadow-lg rounded-full text-white w-12 h-12',
                !network.isMainnet && 'bg-orange-500 dark:bg-orange-600 p-1'
              )}
            />
          </div>
        ) : (
          <div className="min-w-max px-2">
            <img src={assetPlaceholder} className="w-8 h-8" alt="asset" />
          </div>
        )}
        <div>
          <div className="text-base font-bold">{name || 'Unknown'}</div>
          <div className="space-x-2 opacity-80 font-mono">
            {ticker && <span>{ticker}</span>}
            {!network ? (
              <span className="text-xs opacity-70">{id}</span>
            ) : (
              <b
                className={
                  network.isMainnet
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-orange-600 dark:text-orange-500'
                }
              >
                {network.isMainnet ? 'MainNet' : 'TestNet'}
              </b>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 divide-x divide-opacity-50 dark:divide-gray-600">
        <div className="flex items-end space-x-2 px-2">
          <Amount amount={amount} decimals={decimals} size={1.25} />
          {ticker && <span className="font-mono opacity-80">{ticker}</span>}
        </div>
        <div className="px-4 flex space-x-2 items-center">
          {amount > 0 && (
            <Link to={`/send/${id}`}>
              <IconButton IconComponent={FaPaperPlane} small name="Send" />
            </Link>
          )}
          {!network && (
            <IconButton IconComponent={FaTrash} small name="Opt out" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default AssetBar;
