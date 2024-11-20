import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import socketService from '../../services/SocketService';
import { Channel, ChatMessage } from '../../types';
import { SendMessage } from './SendMessage';
import { SystemMessage } from './SystemMessage';
import { ReceivedMessage } from './ReceivedMessage';

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName] = useState('You');

  useEffect(() => {
    const messageListener = (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socketService.subscribeToEvent('chat-message', messageListener);

    const channelSelectedListener = (selectedChannel: Channel) => {
      const systemMessage = {
        message: `Switched to ${selectedChannel.name}'s stream`,
        timestamp: new Date().toISOString(),
        userId: 'System',
      };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    }
    socketService.subscribeToEvent('channel-selected', channelSelectedListener);

    return () => {
      socketService.unsubscribeFromEvent('chat-message', messageListener);
      socketService.unsubscribeFromEvent('channel-selected', channelSelectedListener);
    };
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
        {messages.map((msg) => {
          if(msg.userId === userName) {
            return <SendMessage msg={msg}></SendMessage>;
          } else if(msg.userId === 'System') {
            return <SystemMessage msg={msg}></SystemMessage>;
          } else {
            return <ReceivedMessage msg={msg}></ReceivedMessage>;
          }      
        })}
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
