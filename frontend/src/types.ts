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
}

export interface ChatMessage {
  userId: string;
  message: string;
  timestamp: string;
}