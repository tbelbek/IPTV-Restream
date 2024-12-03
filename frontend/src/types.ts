// Not used
export interface User {
  name: string;
  avatar: string;
}

export interface RandomUser {
  results: {
    name: {
      first: string;
      last: string;
    },
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    }
  }[];
};

export interface Channel {
  id: number;
  name: string;
  url: string;
  avatar: string;
  restream: boolean;
  headers: CustomHeader[];
}

export interface ChatMessage {
  id: number;
  user: User;
  message: string;
  timestamp: string;
}


export interface CustomHeader {
  key: string;
  value: string;
}