import { IMessage, IMessageSend } from "src/models/message";
import { OnlineUserAction } from "./store";

export interface IWebSocket {
  SendMessage: (message: IMessageSend) => void;
  OnMessage: (data: IMessage) => void;
  OnActionOnlineUser: (chats: number[], w: OnlineUserAction) => void;
  OnUserInsertedToChat: () => void;
  OnClosed: () => void;
  CreateConnection: () => void;
  CloseConnection: () => void;
  GetKey: () => (CryptoKey | null);
}

export interface IWebSocketUserMessage {
  mtype: string;
  content: {
    chatID: number;
    content: {
      content: string;
      documents: number[];
      type: number;
    };
    token: string;
  };
}

export interface IWebSocketEncryptedMessage {
  mtype: string;
  key: string;
  data: string;
  iv: string;
}

export interface IWebSocketUserMessageRecieve {
  id: number;
  chat_id: number;
  message: {
    content: string;
    documents: number[];
    type: number;
  };
  author_id: number;
  author_name: string;
  author_login: string;
  time: number;
  type: string;
}

export interface IWebSocketSystemMessage {
  action: string;
  mtype: string;
  result?: string;
  chats?: number[];
  self?: boolean;
}

export interface IWebSocketSystemMessageAuth {
  action: string;
  result: string;
  mtype: string;
  key: string;
}

export interface IWebSocketSystemMessageOnline {
  action: string;
  chats: number[];
  mtype: string;
  move: OnlineUserAction;
}

export enum IwebSocketSystemCommands {
  InsertedToChat = 1,
  CreatedChat,
  InsertedToChannel,
  CreatedChannel,
}

export interface IWebSocketSystemMessageUserInsertedToChat {
  action: string;
  chat_id: number;
  self: boolean;
  mtype: string;
}

export interface IServerActionOnlineUser {
  Chats: number[];
  Type: OnlineUserAction;
}

export interface IServerActionUserInserted {
  ChatID: number;
}

export interface IWebSocketData {
  URL: string;
  Token: string;
  Logs: boolean;
  Imitation: boolean;
}
