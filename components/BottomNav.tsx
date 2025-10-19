import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ICONS } from '../constants';

const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/home', label: t('nav.home'), icon: ICONS.Home },
    { path: '/home/bookings', label: t('nav.bookings'), icon: ICONS.Bookings },
    { path: '/home/messages', label: t('nav.messages'), icon: ICONS.Messages },
    { path: '/home/profile', label: t('nav.profile'), icon: ICONS.Profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-dark-surface border-t border-gray-700 max-w-md mx-auto">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/home'} // Ensure only exact match for home is active
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full transition-colors duration-200 ${
                isActive ? 'text-brand-primary' : 'text-dark-text-secondary hover:text-dark-text'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;