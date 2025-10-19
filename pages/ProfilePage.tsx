import React from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../auth/AuthContext';

const ProfileOption: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="flex items-center w-full text-left p-4 bg-dark-surface rounded-lg hover:bg-gray-700 transition-colors">
    <span className="mr-4 text-brand-primary text-2xl">{icon}</span>
    <span className="flex-1">{label}</span>
    <span className="text-dark-text-secondary">&gt;</span>
  </button>
);

const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };
  
  const handleLogout = () => {
    logout();
    // The ProtectedRoute component will handle redirecting to login.
  }

  if (!user) {
    return <div className="p-4"><LoadingSpinner /></div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-dark-surface" />
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-dark-text-secondary">{user.email}</p>
      </div>

      <div className="space-y-3">
        <ProfileOption icon="👤" label={t('profile.edit')} />
        <ProfileOption icon="💳" label={t('profile.payment')} />
        <ProfileOption icon="⚙️" label={t('profile.settings')} />
        <div className="flex items-center w-full text-left p-4 bg-dark-surface rounded-lg">
           <span className="mr-4 text-brand-primary text-2xl">🌐</span>
           <label htmlFor="language-select" className="flex-1">{t('profile.language')}</label>
           <select
             id="language-select"
             value={i18n.language.split('-')[0]}
             onChange={handleLanguageChange}
             className="bg-dark-surface border-none text-dark-text focus:outline-none focus:ring-0"
           >
             <option value="en">English</option>
             <option value="es">Español</option>
             <option value="fr">Français</option>
           </select>
        </div>
        <ProfileOption icon="❓" label={t('profile.help')} />
      </div>
      
      <div className="pt-4">
        <button onClick={handleLogout} className="w-full p-4 bg-dark-surface rounded-lg text-red-500 font-semibold hover:bg-red-900/20 transition-colors">
          {t('profile.logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;