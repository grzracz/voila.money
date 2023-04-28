import React from 'react';
import SidebarLink from './SidebarLink';
import {
  MdAccountBalance,
  MdExplore,
  MdPhoto,
  MdAccessTime,
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { t } = useTranslation();

  return (
    <aside className="fixed flex p-2 md:space-y-4 md:p-4 md:flex-col justify-around md:justify-start inset-x-0 bottom-0 z-10 md:relative md:col-span-1 md:top-auto md:left-0 md:bottom-0 md:items-start transition-all">
      <SidebarLink
        IconComponent={MdAccountBalance}
        name={t('components.Sidebar.Assets', 'Assets')}
        to="/"
        disabled={disabled}
      />
      <SidebarLink
        IconComponent={MdPhoto}
        name={t('components.Sidebar.NFTs', 'NFTs')}
        to="/nfts"
        disabled={disabled}
      />
      <SidebarLink
        IconComponent={MdExplore}
        name={t('components.Sidebar.Explore', 'Explore')}
        to="/explore"
        disabled={disabled}
      />
      <SidebarLink
        IconComponent={MdAccessTime}
        name={t('components.Sidebar.Activity', 'Activity')}
        to="/activity"
        disabled={disabled}
      />
    </aside>
  );
};

export default Sidebar;
