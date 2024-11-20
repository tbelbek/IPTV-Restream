import { ChatMessage } from "../../types";

export function ReceivedMessage({ msg }: { 
    msg: ChatMessage 
}) {
  return (
    <div className="flex items-start space-x-3 pr-10">
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
  );
}