import React from 'react';
import { useTranslation } from 'react-i18next';
import { GeoLocation, Professional } from '../types';
import { ICONS } from '../constants';

interface MapComponentProps {
  userLocation: GeoLocation;
  professionals: Professional[];
  onProfessionalClick: (professional: Professional) => void;
  selectedProfessionalId?: string | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, professionals, onProfessionalClick, selectedProfessionalId }) => {
  const { t } = useTranslation();
  const getPositionStyle = (location: GeoLocation) => {
    // Using percentage for better responsiveness in a full-screen context
    const x = (Math.abs(location.lon) % 1) * 100;
    const y = (Math.abs(location.lat) % 1) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="relative w-full h-full bg-gray-700 overflow-hidden">
      <img src={`https://picsum.photos/800/1200?grayscale&blur=2`} alt="Map background" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* User Pin */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{...getPositionStyle(userLocation), zIndex: 1}}
        aria-label="Your Location"
      >
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white ring-4 ring-blue-500 ring-opacity-50"></div>
      </div>

      {/* Professional Pins */}
      {professionals.map((pro) => {
        const Icon = ICONS[pro.serviceType];
        const isSelected = pro._id === selectedProfessionalId;
        return (
          <div
            key={pro._id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer flex flex-col items-center"
            style={{ ...getPositionStyle(pro.location), zIndex: isSelected ? 20 : 10, transition: 'transform 0.2s ease' }}
            onClick={() => onProfessionalClick(pro)}
          >
            {/* Info Window */}
            <div className={`bg-dark-surface p-2 rounded-lg shadow-lg mb-2 text-center w-36 transition-all duration-200 ${isSelected ? 'scale-110 ring-2 ring-brand-primary' : 'scale-100'}`}>
                <p className="font-bold text-sm truncate text-dark-text">{pro.name}</p>
                <p className="text-xs text-dark-text-secondary">{t(`service.${pro.serviceType}`)}</p>
                <div className="flex items-center justify-center text-xs mt-1">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span>{pro.rating.toFixed(1)}</span>
                </div>
            </div>
            {/* Pin Icon */}
             <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MapComponent;
