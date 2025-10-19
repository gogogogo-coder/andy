import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MapComponent from '../components/MapComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllAvailableProfessionals, getNearbyProfessionals } from '../services/api';
import { Professional, ServiceCategory, GeoLocation } from '../types';
import { SERVICE_CATEGORIES } from '../constants';
import ProfessionalDetailSheet from '../components/ProfessionalDetailSheet';
import { useAuth } from '../auth/AuthContext';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  
  const navigate = useNavigate();

  const userLocation: GeoLocation = user?.location || { lat: 48.8566, lon: 2.3522 }; 

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true);
      setSelectedProfessional(null);
      const data = selectedCategory === 'All'
        ? await getAllAvailableProfessionals()
        : await getNearbyProfessionals(userLocation, selectedCategory);
      setProfessionals(data);
      setLoading(false);
    };

    fetchProfessionals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleBookNow = (professional: Professional) => {
    // In a real app, this would go to a booking confirmation screen
    alert(`Booking ${professional.name} for ${t(`service.${professional.serviceType}`)}.`);
    // Simulate booking and go to tracking
    navigate('/tracking/booking123');
  };

  const handleSelectProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
  };

  const handleCloseSheet = () => {
    setSelectedProfessional(null);
  };

  return (
    <div className="absolute inset-0">
      <div className="h-full w-full relative">
        <MapComponent 
          userLocation={userLocation} 
          professionals={professionals} 
          onProfessionalClick={handleSelectProfessional}
          selectedProfessionalId={selectedProfessional?._id}
        />
        
        <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/60 to-transparent">
          <header className="mb-4">
            <h1 className="text-2xl font-bold">{t('home.title')}</h1>
            <p className="text-dark-text-secondary">{t('home.subtitle')}</p>
          </header>
          
          <div className="relative">
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory | 'All')}
              className="w-full p-3 bg-dark-surface border border-gray-600 rounded-lg text-dark-text appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="All">{t('home.allProfessionals')}</option>
              {SERVICE_CATEGORIES.map(({ name }) => (
                <option key={name} value={name}>
                  {t(`service.${name}`)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-text-secondary">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <LoadingSpinner />
          </div>
        )}

        {selectedProfessional && (
            <ProfessionalDetailSheet 
                professional={selectedProfessional}
                onBook={handleBookNow}
                onClose={handleCloseSheet}
            />
        )}
      </div>
    </div>
  );
};

export default HomePage;