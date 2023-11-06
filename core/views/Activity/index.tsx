import React from 'react';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useAccount, AccountTransactionInformation } from '../../utils/account';
import TransactionCard from './TransactionCard';

const Activity: React.FC = () => {
  const { transactions } = useAccount();
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1 className="font-bold text-center md:text-left text-3xl md:text-5xl py-4">
        Recent <span className="blue">activity</span>
        <div className="flex w-full max-w-screen-lg flex-col space-y-2">
          {transactions[0]?.map((t: any) => (
            <TransactionCard
              id={t['id']}
              key={t['id']}
              transaction={t}
              amount={t['asset-transfer-transaction']?.['amount']}
              assetId={t['asset-transfer-transaction']?.['asset-id']}
            />
          ))}
        </div>
      </h1>
    </div>
  );
};

export default Activity;
