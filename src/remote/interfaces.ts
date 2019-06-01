export interface IMessageServer {
  content: string;
  documents: IMessageServerDoc[];
  type: string;
  command: number;
}

export interface IMessageServerDoc {
  id: number;
  name: string;
  author_id: number;
  path: string;
  ratio: number;
  duration: number;
  size: number;
}

export interface IChatServer {
  admin_id: number;
  delete: boolean;
  id: number;
  last_message: IMessageServer;
  last_message_time: number;
  last_sender: string;
  name: string;
  online: number;
  type: 0;
  view: 0;
}

export interface IIMessageServer {
  id: number;
  chat_id: number;
  message: IMessageServer;
  author_id: number;
  author_name: string;
  author_login: string;
  time: number;
}
