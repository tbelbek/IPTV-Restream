import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import socketService from '../services/SocketService';
import { ChatMessage } from '../types';

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName] = useState('You');

  useEffect(() => {
    socketService.subscribeToEvents({
      'chat-message': (message: ChatMessage) => setMessages((prev) => [...prev, message]),
    });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketService.sendMessage(userName, newMessage, new Date().toISOString()); 

    setMessages((prev) => [
      ...prev,
      {
        userId: userName,
        message: newMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
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
          <div className="flex items-start space-x-3">
            {/* TODO: fetch random images */}
            <img src={`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=64&h=64&fit=crop&crop=faces`} alt={msg.userId} className="w-8 h-8 rounded-full" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{msg.userId}</span>
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
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 p-1.5 rounded-lg transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
