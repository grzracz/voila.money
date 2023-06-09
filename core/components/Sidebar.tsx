import React from 'react';
import SidebarLink from './SidebarLink';

import { useTranslation } from 'react-i18next';
import { FaClock, FaCoins, FaImages, FaSearch } from 'react-icons/fa';

const Sidebar: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { t } = useTranslation();

  return (
    <aside className="fixed text-xs flex p-2 md:space-y-4 md:p-4 md:flex-col justify-around md:justify-start inset-x-0 bottom-0 md:relative md:col-span-1 md:top-auto md:left-0 md:bottom-0 md:items-start transition-all">
      <SidebarLink
        IconComponent={FaCoins}
        name={t('components.Sidebar.Assets', 'Assets')}
        to="/"
        disabled={disabled}
      />
      <SidebarLink
        IconComponent={FaImages}
        name={t('components.Sidebar.NFTs', 'NFTs')}
        to="/nfts"
        disabled={true}
      />
      <SidebarLink
        IconComponent={FaSearch}
        name={t('components.Sidebar.Explore', 'Explore')}
        to="/explore"
        disabled={true}
      />
      <SidebarLink
        IconComponent={FaClock}
        name={t('components.Sidebar.Activity', 'Activity')}
        to="/activity"
        disabled={true}
      />
    </aside>
  );
};

export default Sidebar;
