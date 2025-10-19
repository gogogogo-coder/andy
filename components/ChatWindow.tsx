
import React, { useState, useEffect, useRef } from 'react';
import { Message, User, Professional } from '../types';
import { getMessages, sendMessage } from '../services/api';
import { getAIAssistantResponse } from '../services/geminiService';

interface ChatWindowProps {
  currentUser: User;
  otherParticipant: User | Professional;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, otherParticipant }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isAIConversation = otherParticipant.name === "AI Assistant";

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const fetchedMessages = await getMessages(currentUser._id, otherParticipant._id);
      setMessages(fetchedMessages);
      setIsLoading(false);
    };

    fetchMessages();
  }, [currentUser._id, otherParticipant._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      senderId: currentUser._id,
      receiverId: otherParticipant._id,
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    if (isAIConversation) {
        const aiResponse = await getAIAssistantResponse(newMessage);
        const aiMessage: Message = {
            _id: (Date.now() + 1).toString(),
            senderId: otherParticipant._id,
            receiverId: currentUser._id,
            message: aiResponse,
            timestamp: new Date(),
            isAIMessage: true,
        };
        setMessages(prev => [...prev, aiMessage]);
    } else {
        await sendMessage(userMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-dark-bg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-end gap-2 ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderId !== currentUser._id && (
              <img src={otherParticipant.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            )}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.senderId === currentUser._id
                  ? 'bg-brand-primary text-white rounded-br-none'
                  : 'bg-dark-surface text-dark-text rounded-bl-none'
              }`}
            >
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-dark-text-secondary">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-dark-surface border-t border-gray-700">
        <div className="flex items-center bg-gray-700 rounded-full p-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherParticipant.name}...`}
            className="flex-1 bg-transparent px-4 py-2 text-dark-text focus:outline-none"
          />
          <button
            type="submit"
            className="bg-brand-primary rounded-full p-2 text-white disabled:bg-gray-500"
            disabled={!newMessage.trim() || isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
