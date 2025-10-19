import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getConversations } from '../services/api';
import { Conversation, User, Professional } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../auth/AuthContext';

const MessagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      setLoading(true);
      const data = await getConversations(user._id);
      setConversations(data);
      setLoading(false);
    };
    fetchConversations();
  }, [user]);
  
  const getParticipantService = (participant: User | Professional): string => {
      if (participant._id === 'ai-assistant') {
          return t('service.AIAssistant');
      }
      return t(`service.${(participant as Professional).serviceType}`);
  }

  if (!user) {
    return <div className="p-4"><LoadingSpinner /></div>;
  }
  
  if (selectedConversation) {
    return (
      <div>
        <header className="p-4 bg-dark-surface flex items-center gap-4">
          <button onClick={() => setSelectedConversation(null)} className="text-dark-text">&larr;</button>
          <img src={(selectedConversation.participant as Professional).avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover"/>
          <div>
            <h2 className="font-bold">{selectedConversation.participant.name}</h2>
            <p className="text-xs text-dark-text-secondary">{getParticipantService(selectedConversation.participant)}</p>
          </div>
        </header>
        <ChatWindow currentUser={user} otherParticipant={selectedConversation.participant} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('nav.messages')}</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-2">
          {conversations.map((convo) => (
            <div
              key={convo._id}
              onClick={() => setSelectedConversation(convo)}
              className="flex items-center p-3 bg-dark-surface rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <img src={(convo.participant as Professional).avatarUrl} alt={convo.participant.name} className="w-14 h-14 rounded-full object-cover mr-4" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-bold">{convo.participant.name}</h3>
                  <p className="text-xs text-dark-text-secondary">{new Date(convo.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-dark-text-secondary truncate w-4/5">{convo.lastMessage}</p>
                    {convo.unreadCount > 0 && 
                        <span className="bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {convo.unreadCount}
                        </span>
                    }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;