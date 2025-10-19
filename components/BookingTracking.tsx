import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBookingDetails, getProfessionalLocationStream } from '../services/api';
import { Booking, GeoLocation } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { ICONS } from '../constants';
import { useAuth } from '../auth/AuthContext';

const BookingTracking: React.FC = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Use auth context for the current user
  const [booking, setBooking] = useState<Booking | null>(null);
  const [proLocation, setProLocation] = useState<GeoLocation | null>(null);
  const [eta, setEta] = useState(15);

  // Effect to fetch booking data based on the ID from the URL
  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingData = async () => {
      const bookingData = await getBookingDetails(bookingId);
      setBooking(bookingData);
      if (bookingData) {
        // Set the initial location from the fetched booking data
        setProLocation(bookingData.professional.location);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  // Effect to handle the location stream and ETA interval once booking data is available
  useEffect(() => {
    // Exit if we don't have the necessary booking info yet
    if (!booking || !booking.professionalId) return;

    // Start the location stream with the CORRECT professional ID
    const unsubscribe = getProfessionalLocationStream(booking.professionalId, (newLocation) => {
      setProLocation(newLocation);
    });
    
    // Start the ETA countdown
    const etaInterval = setInterval(() => {
        setEta(prev => Math.max(0, prev - 1));
    }, 60 * 1000);

    // Cleanup function to stop the stream and interval when the component unmounts
    return () => {
        unsubscribe();
        clearInterval(etaInterval);
    };
  }, [booking]); // This effect is dependent on the booking object

  if (!booking || !user) {
    return <div className="h-screen w-full flex items-center justify-center bg-dark-bg"><LoadingSpinner /></div>;
  }
  
  const mapWidth = 500;
  const mapHeight = 800;
  
  const getPositionStyle = (location: GeoLocation) => {
    const x = (Math.abs(location.lon) % 1) * mapWidth;
    const y = (Math.abs(location.lat) % 1) * mapHeight;
    return { left: `${x}px`, top: `${y}px` };
  };

  const ProfessionalIcon = ICONS[booking.professional.serviceType];

  return (
    <div className="h-screen w-full max-w-md mx-auto flex flex-col bg-dark-bg">
      <header className="p-4 bg-dark-surface shadow-md z-10">
        <button onClick={() => navigate(-1)} className="text-dark-text">&larr; {t('tracking.back')}</button>
        <h1 className="text-xl font-bold text-center -mt-6">{t('tracking.title')}</h1>
      </header>

      <div className="flex-1 relative overflow-hidden">
         <div className="absolute inset-0 bg-gray-700">
            <img src={`https://picsum.photos/${mapWidth}/${mapHeight}?grayscale&blur=2`} alt="Map background" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* User Marker */}
            {user && user.location && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={getPositionStyle(user.location)}
                aria-label="Your Location"
              >
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white ring-4 ring-blue-500 ring-opacity-50"></div>
              </div>
            )}

            {/* Professional Marker */}
            {proLocation && (
              <div 
                className="absolute transition-all duration-1000 ease-linear"
                style={getPositionStyle(proLocation)}
              >
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg" aria-label="Professional's Location">
                      <ProfessionalIcon className="w-5 h-5 text-white" />
                  </div>
              </div>
            )}
         </div>
      </div>
      
      <footer className="bg-dark-surface p-4 rounded-t-2xl shadow-lg z-10">
        <div className="text-center mb-4">
            <p className="text-lg">{t('tracking.eta')}</p>
            <p className="text-3xl font-bold text-brand-secondary">{eta} {t('tracking.minutes')}</p>
        </div>
        <div className="flex items-center space-x-4">
            <img src={booking.professional.avatarUrl} alt={booking.professional.name} className="w-16 h-16 rounded-full object-cover" />
            <div className="flex-1">
                <h3 className="font-bold text-lg">{booking.professional.name}</h3>
                <p className="text-sm text-dark-text-secondary">{t(`service.${booking.professional.serviceType}`)}</p>
                <div className="flex items-center text-sm mt-1">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span>{booking.professional.rating.toFixed(1)}</span>
                </div>
            </div>
            <div className="flex space-x-2">
                <button className="bg-gray-600 p-3 rounded-full hover:bg-gray-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                 <button className="bg-brand-secondary p-3 rounded-full hover:bg-green-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </button>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default BookingTracking;