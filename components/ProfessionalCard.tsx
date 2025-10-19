
import React from 'react';
import { Professional } from '../types';

interface ProfessionalCardProps {
  professional: Professional;
  onBook: (professional: Professional) => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, onBook }) => {
  const distance = Math.random() * 5 + 0.5; // Simulated distance

  return (
    <div className="bg-dark-surface p-4 rounded-lg shadow-md flex items-center space-x-4">
      <img src={professional.avatarUrl} alt={professional.name} className="w-16 h-16 rounded-full object-cover" />
      <div className="flex-1">
        <h3 className="font-bold text-lg text-dark-text">{professional.name}</h3>
        <p className="text-sm text-dark-text-secondary">{professional.serviceType}</p>
        <div className="flex items-center text-sm mt-1">
          <span className="text-yellow-400 mr-1">⭐</span>
          <span>{professional.rating.toFixed(1)}</span>
          <span className="mx-2 text-gray-500">|</span>
          <span>{distance.toFixed(1)} km away</span>
        </div>
      </div>
      <button 
        onClick={() => onBook(professional)}
        className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Book
      </button>
    </div>
  );
};

export default ProfessionalCard;
