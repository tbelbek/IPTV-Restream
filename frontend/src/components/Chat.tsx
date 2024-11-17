import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: {
        name: 'Alex Thompson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces',
      },
      message: 'Amazing stream today! 🔥',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      user: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
      },
      message: 'The quality is incredible!',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const handleNewMessage = (event: CustomEvent<ChatMessage>) => {
      setMessages(prev => [...prev, event.detail]);
    };

    window.addEventListener('newChatMessage', handleNewMessage as EventListener);
    return () => {
      window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: messages.length + 1,
      user: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=faces',
      },
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="bg-gray-800 rounded-lg h-full">
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">Live Chat</h2>
      </div>
      
      <div className="h-[calc(100vh-13rem)] overflow-y-auto p-4 space-y-4 scroll-container vertical-scroll-container">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-3">
            {msg.user.avatar ? (
              <img
                src={msg.user.avatar}
                alt={msg.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8" /> // Spacer for system messages
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${msg.user.name === 'System' ? 'text-blue-400' : ''}`}>
                  {msg.user.name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-300">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-gray-700 rounded-lg pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 p-1.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;