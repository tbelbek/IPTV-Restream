import React from 'react';
import { Channel } from '../types';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
}

function ChannelList({ channels, selectedChannel, onSelectChannel }: ChannelListProps) {

  return (
    <div className="flex space-x-3 hover:overflow-x-auto overflow-hidden pb-2 px-1 pt-1 scroll-container">
      {channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => onSelectChannel(channel)}
          className={`group relative p-2 rounded-lg transition-all ${
            selectedChannel.id === channel.id
              ? 'bg-blue-500 bg-opacity-20 ring-2 ring-blue-500'
              : 'hover:bg-gray-700'
          }`}
        >
          <div className="h-20  w-20 mb-2 flex items-center justify-center rounded-lg overflow-hidden mx-auto">
            <img
              src={channel.avatar}
              alt={channel.name}
              className="w-full h-full object-contain rounded-lg transition-transform group-hover:scale-105"
            />
            
          </div>
          <p className="text-sm font-medium truncate text-center">
            {channel.name}
          </p>
        </button>
      ))}
    </div>
  );
}

export default ChannelList;