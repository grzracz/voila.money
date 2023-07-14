import React from 'react';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useAccount, AccountAssetInformation } from '../../utils/account';

const Activity: React.FC = () => {
  const { account, assets } = useAccount();
  const [loading, setLoading] = useState(false);
  //console.log("account" ,account)
  return (
    <div>
      <h1 className="font-bold text-center md:text-left text-3xl md:text-5xl py-4">
        Recent <span className="blue">activity</span>
      </h1>
    </div>
  );
};

export default Activity;
