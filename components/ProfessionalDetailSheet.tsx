import React from 'react';
import { useTranslation } from 'react-i18next';
import { Professional } from '../types';

interface ProfessionalDetailSheetProps {
  professional: Professional;
  onBook: (professional: Professional) => void;
  onClose: () => void;
}

const ProfessionalDetailSheet: React.FC<ProfessionalDetailSheetProps> = ({ professional, onBook, onClose }) => {
  const { t } = useTranslation();
  const distance = (Math.random() * 5 + 0.5).toFixed(1); // Simulated distance

  return (
    <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto z-20" aria-modal="true" role="dialog">
      <div className="bg-dark-surface p-4 shadow-lg animate-slide-up rounded-t-2xl">
        <div className="flex justify-center mb-2">
            <div className="w-10 h-1 bg-gray-600 rounded-full" onClick={onClose}></div>
        </div>
        <div className="p-4 rounded-lg flex items-center space-x-4">
          <img src={professional.avatarUrl} alt={professional.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="font-bold text-lg text-dark-text">{professional.name}</h3>
            <p className="text-sm text-dark-text-secondary">{t(`service.${professional.serviceType}`)}</p>
            <div className="flex items-center text-sm mt-1">
              <span className="text-yellow-400 mr-1">⭐</span>
              <span>{professional.rating.toFixed(1)}</span>
              <span className="mx-2 text-gray-500">|</span>
              <span>{t('details.distanceAway', { distance })}</span>
            </div>
          </div>
        </div>
        <button 
            onClick={() => onBook(professional)}
            className="mt-2 w-full bg-brand-primary text-white font-semibold px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
            {t('details.bookNow', { rate: professional.rate })}
        </button>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ProfessionalDetailSheet;
