import { useState, useEffect } from 'react';
import { Search, Plus, Settings, Users, Radio, Tv2 } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import ChannelList from './components/ChannelList';
import Chat from './components/chat/Chat';
import AddChannelModal from './components/add_channel/AddChannelModal';
import { Channel } from './types';
import socketService from './services/SocketService';
import apiService from './services/ApiService';
import SettingsModal from './components/SettingsModal';
import { ToastProvider } from './components/notifications/ToastContext';
import ToastContainer from './components/notifications/ToastContainer';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(() => {
    const savedValue = localStorage.getItem('syncEnabled');
    return savedValue !== null ? JSON.parse(savedValue) : true;
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {

    apiService
      .request<Channel[]>('/channels/', 'GET')
      .then((data) => setChannels(data))
      .catch((error) => console.error('Error loading channels:', error));

    apiService
      .request<Channel>('/channels/current', 'GET')
      .then((data) => setSelectedChannel(data))
      .catch((error) => console.error('Error loading current channel:', error));


    console.log('Subscribing to events');
    const channelAddedListener = (channel: Channel) => {
      setChannels((prevChannels) => [...prevChannels, channel]);
    };

    const channelSelectedListener = (nextChannel: Channel) => {
      setSelectedChannel(nextChannel);
    };

    socketService.subscribeToEvent('channel-added', channelAddedListener);
    socketService.subscribeToEvent('channel-selected', channelSelectedListener);

    socketService.connect();

    return () => {
      socketService.unsubscribeFromEvent('channel-added', channelAddedListener);
      socketService.unsubscribeFromEvent('channel-selected', channelSelectedListener);
      socketService.disconnect();
      console.log('WebSocket connection closed');
    };
  }, []);


  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto py-4">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Radio className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold">StreamHub</h1>
            </div>
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <Users className="w-6 h-6 text-blue-500" />
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Settings className="w-6 h-6 text-blue-500" />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Tv2 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">Live Channels</h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <ChannelList
                  channels={filteredChannels}
                  selectedChannel={selectedChannel}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              <VideoPlayer channel={selectedChannel} syncEnabled={syncEnabled}/>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <Chat />
            </div>
          </div>
        </div>

        <AddChannelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          syncEnabled={syncEnabled}
          onSyncChange={(enabled) => {
            setSyncEnabled(enabled);
            localStorage.setItem('syncEnabled', JSON.stringify(enabled));
          }}
        />

        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;