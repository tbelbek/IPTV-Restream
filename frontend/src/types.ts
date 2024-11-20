// Not used
export interface User {
  name: string;
  avatar: string;
}

export interface Channel {
  id: number;
  name: string;
  url: string;
  avatar: string;
  restream: boolean;
}

export interface ChatMessage {
  userId: string;
  message: string;
  timestamp: string;
}