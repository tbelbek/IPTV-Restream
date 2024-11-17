export interface User {
  name: string;
  avatar: string;
}

export interface Channel {
  id: number;
  name: string;
  url: string;
  isLive: boolean;
  avatar: string;
}

export interface ChatMessage {
  id: number;
  user: User;
  message: string;
  timestamp: string;
}