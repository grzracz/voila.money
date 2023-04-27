import React from 'react';
import SidebarLink from './SidebarLink';
import {
  MdAccountBalance,
  MdExplore,
  MdPhoto,
  MdAccessTime,
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside className="fixed flex p-2 md:space-y-4 md:p-4 md:flex-col justify-around md:justify-start inset-x-0 bottom-0 z-10 md:relative md:col-span-1 md:top-auto md:left-0 md:bottom-0 md:items-start transition-all">
      <SidebarLink
        IconComponent={MdAccountBalance}
        name={t('components.Sidebar.Assets', 'Assets')}
        to="/"
      />
      <SidebarLink
        IconComponent={MdPhoto}
        name={t('components.Sidebar.NFTs', 'NFTs')}
        to="/nfts"
      />
      <SidebarLink
        IconComponent={MdExplore}
        name={t('components.Sidebar.Explore', 'Explore')}
        to="/explore"
      />
      <SidebarLink
        IconComponent={MdAccessTime}
        name={t('components.Sidebar.Activity', 'Activity')}
        to="/activity"
      />
    </aside>
  );
};

export default Sidebar;
