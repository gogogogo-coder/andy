import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getBookings } from '../services/api';
import { Booking, BookingStatus } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isCompleted = booking.status === BookingStatus.Completed || booking.status === BookingStatus.Cancelled;

    const handleCardClick = () => {
        if(booking.liveTracking && booking.status === BookingStatus.InProgress) {
            navigate(`/tracking/${booking._id}`);
        }
    }

    return (
        <div onClick={handleCardClick} className={`bg-dark-surface p-4 rounded-lg shadow-md ${booking.liveTracking && booking.status === BookingStatus.InProgress ? 'cursor-pointer hover:bg-gray-700' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-brand-secondary">{t(`service.${booking.serviceType}`)}</p>
                    <h3 className="font-bold text-lg">{booking.professional.name}</h3>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isCompleted ? 'bg-gray-600 text-gray-200' : 'bg-green-600 text-green-100'
                }`}>
                    {t(`status.${booking.status}`)}
                </span>
            </div>
            <div className="mt-4 text-sm text-dark-text-secondary">
                <p>{t('bookings.dateLabel')}: {new Date(booking.startTime).toLocaleDateString()}</p>
                <p>{t('bookings.timeLabel')}: {new Date(booking.startTime).toLocaleTimeString()}</p>
            </div>
             {booking.status === BookingStatus.InProgress && booking.liveTracking && (
                <div className="mt-3 text-sm font-bold text-brand-primary animate-pulse">
                    {t('bookings.trackPrompt')}
                </div>
            )}
        </div>
    );
};

const BookingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      const data = await getBookings(user._id);
      setBookings(data);
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  const filteredBookings = bookings.filter(b => {
      const isCompleted = b.status === BookingStatus.Completed || b.status === BookingStatus.Cancelled;
      return filter === 'active' ? !isCompleted : isCompleted;
  });

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('bookings.title')}</h1>
      
      <div className="flex mb-4 bg-dark-surface p-1 rounded-lg">
        <button 
          onClick={() => setFilter('active')}
          className={`w-1/2 py-2 rounded-md transition-colors ${filter === 'active' ? 'bg-brand-primary text-white' : 'text-dark-text-secondary'}`}
        >
          {t('bookings.active')}
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`w-1/2 py-2 rounded-md transition-colors ${filter === 'completed' ? 'bg-brand-primary text-white' : 'text-dark-text-secondary'}`}
        >
          {t('bookings.completed')}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => <BookingCard key={booking._id} booking={booking} />)
          ) : (
            <p className="text-center text-dark-text-secondary py-8">{filter === 'active' ? t('bookings.noActive') : t('bookings.noCompleted')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;