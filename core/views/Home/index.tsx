import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useStore } from '../../utils/store';
import AssetBar from './AssetBar';
import Card from '../../components/Card';
import { useAccount, AccountAssetInformation } from '../../utils/account';
import Loader from '../../components/Loader';
import { FaExclamationTriangle, FaKey, FaPlus } from 'react-icons/fa';
import AccountName from '../../components/AccountName';
import IconButton from '../../components/IconButton';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { state } = useStore();
  const { account, assets } = useAccount();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    setLoading(true);
  }, [state.node, state.primaryAddress]);

  useEffect(() => {
    if (account) {
      setLoading(false);
    }
  }, [account]);

  const tokenBalance = Math.max(
    account ? account.amount - account['min-balance'] : 0,
    0
  );

  const [holdingAssets, emptyAssets] = useMemo(() => {
    const sort = (a: AccountAssetInformation, b: AccountAssetInformation) => {
      return a['asset-id'] - b['asset-id'];
    };

    const holding: AccountAssetInformation[] = [];
    const empty: AccountAssetInformation[] = [];
    account?.assets.forEach((a) => {
      if (a.amount > 0) holding.push(a);
      else empty.push(a);
    });
    holding.sort(sort);
    empty.sort(sort);
    return [holding, empty];
  }, [account]);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="w-full flex-col justify-center space-y-8">
        <div className="w-full">
          <AssetBar
            id={0}
            assets={assets}
            amount={tokenBalance}
            network={state.network}
          />
          {account?.['auth-addr'] && (
            <div className="flex w-full space-x-4 text-xs sm:text-sm items-center p-4 pr-8">
              {state.addresses.includes(account?.['auth-addr']) ? (
                <FaKey
                  className="blue"
                  size={state.display === 'extension' ? 16 : 24}
                />
              ) : (
                <FaExclamationTriangle
                  color="red"
                  size={state.display === 'extension' ? 16 : 24}
                />
              )}
              <div className="flex flex-col items-start">
                <span className="opacity-50">
                  Account rekeyed to
                  {!state.addresses.includes(account?.['auth-addr']) &&
                    ' unimported account'}
                </span>
                <div>
                  <AccountName address={account?.['auth-addr']} />
                </div>
              </div>
            </div>
          )}
        </div>
        {(account?.amount || 0) > 0 && (
          <>
            <div className="flex w-full max-w-screen-lg flex-col space-y-2">
              <div className="flex w-full items-center justify-end">
                <Link to="opt">
                  <IconButton IconComponent={FaPlus} name="Add assets" />
                </Link>
              </div>
              {holdingAssets.length > 0 ? (
                holdingAssets.map((a: any) => (
                  <AssetBar
                    id={a['asset-id']}
                    key={a['asset-id']}
                    assets={assets}
                    amount={a['amount']}
                  />
                ))
              ) : (
                <Card className="opacity-50">
                  <div className="text-center w-full">
                    No assets to be found here. Add some?
                  </div>
                </Card>
              )}
            </div>
            <div className="flex w-full max-w-screen-lg flex-col space-y-2">
              {emptyAssets.map((a: any) => (
                <AssetBar
                  id={a['asset-id']}
                  key={a['asset-id']}
                  assets={assets}
                  amount={a['amount']}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
