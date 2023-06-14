import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useStore } from './store';
import { toast } from 'react-hot-toast';
import { useLocalState } from '../hooks/useLocalState';

export interface AccountAssetInformation {
  amount: number;
  'asset-id': number;
  'is-frozen': boolean;
}

export interface AccountInformation {
  address: string;
  amount: number;
  'min-balance': number;
  'amount-without-pending-rewards': number;
  'apps-local-state': {
    id: number;
    schema: {
      'num-uint': number;
      'num-byte-slice': number;
    };
    'key-value': [
      {
        key: string;
        value: {
          type: number;
          bytes: string;
          uint: number;
        };
      }
    ];
  }[];
  'total-apps-opted-in': number;
  'apps-total-schema': {
    'num-uint': number;
    'num-byte-slice': number;
  };
  'apps-total-extra-pages': number;
  assets: AccountAssetInformation[];
  'total-assets-opted-in': number;
  'created-apps': {
    id: number;
    params: {
      creator: string;
      'approval-program': string;
      'clear-state-program': string;
      'extra-program-pages': number;
      'local-state-schema': {
        'num-uint': number;
        'num-byte-slice': number;
      };
      'global-state-schema': {
        'num-uint': number;
        'num-byte-slice': number;
      };
      'global-state': [
        {
          key: string;
          value: {
            type: number;
            bytes: string;
            uint: number;
          };
        }
      ];
    };
  }[];
  'total-created-apps': number;
  'created-assets': {
    index: number;
    params: {
      clawback: string;
      creator: string;
      decimals: number;
      'default-frozen': true;
      freeze: string;
      manager: string;
      'metadata-hash': string;
      name: string;
      'name-b64': string;
      reserve: string;
      total: number;
      'unit-name': string;
      'unit-name-b64': string;
      url: string;
      'url-b64': string;
    };
  }[];
  'total-created-assets': number;
  participation: {
    'selection-participation-key': string;
    'vote-first-valid': number;
    'vote-key-dilution': number;
    'vote-last-valid': number;
    'vote-participation-key': string;
    'state-proof-key': string;
  };
  'pending-rewards': number;
  'reward-base': number;
  rewards: number;
  round: number;
  status: string;
  'sig-type': string;
  'auth-addr': string;
}

export interface AssetParams {
  clawback: string;
  creator: string;
  decimals: number;
  'default-frozen': true;
  freeze: string;
  manager: string;
  'metadata-hash': string;
  name: string;
  'name-b64': string;
  reserve: string;
  total: number;
  'unit-name': string;
  'unit-name-b64': string;
  url: string;
  'url-b64': string;
}

export interface AssetInformation {
  index: number;
  params: AssetParams;
}

interface AccountProviderProps {
  children: JSX.Element | JSX.Element[];
}

const AccountContext = createContext<AccountContextValue | undefined>(
  undefined
);

export type AssetCache = Record<string, Record<number, AssetParams>>;

interface AccountContextValue {
  assets: Record<number, AssetParams>;
  account: AccountInformation | null;
  refreshAccount: () => void;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const { state } = useStore();
  const [account, setAccount] = useState<AccountInformation | null>(null);
  const [assets, setAssets] = useLocalState<AssetCache>('assets', {});
  const flagRef = useRef<number>(0);

  const updateAccountAssets = useCallback(async () => {
    const networkId = state.network.id;
    if (networkId && account) {
      const chunkSize = 5;
      const unknownAssets = account.assets.filter(
        (a) => !assets[networkId] || !assets[networkId][a['asset-id']]
      );
      for (let i = 0; i < unknownAssets.length; i += chunkSize) {
        const chunk = unknownAssets.slice(i, i + chunkSize);
        const updates: (AssetInformation | null)[] = (await Promise.all([
          ...chunk.map(
            (a) =>
              new Promise(async (resolve) => {
                await state.node
                  .getAssetByID(a['asset-id'])
                  .do()
                  .then(resolve)
                  .catch(() => resolve(null));
              })
          ),
        ])) as (AssetInformation | null)[];
        setAssets((a) => {
          const newAssets = { ...a };
          if (!newAssets[networkId]) newAssets[networkId] = {};
          updates.forEach((u) => {
            if (u !== null) newAssets[networkId][u.index] = u.params;
          });
          return newAssets;
        });
      }
    }
  }, [account]);

  useEffect(() => {
    updateAccountAssets();
  }, [updateAccountAssets]);

  const fetchData = useCallback(async () => {
    if (state.primaryAddress) {
      flagRef.current += 1;
      const thisFlag = flagRef.current;
      try {
        const account = await state.node
          .accountInformation(state.primaryAddress)
          .do();
        if (thisFlag === flagRef.current) {
          setAccount(account as AccountInformation);
        }
      } catch (e) {
        toast.error(
          'Something went wrong while updating account data: ' + e?.toString()
        );
      }
    }
  }, [state.node, state.primaryAddress]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <AccountContext.Provider
      value={{
        account,
        refreshAccount: fetchData,
        assets: assets[state.network.id] || {},
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};
