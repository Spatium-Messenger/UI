import { IMessage, IMessageSend } from "src/models/message";

export interface IWebSocket {
  SendMessage: (message: IMessageSend) => void;
  OnMessage: (data: IMessage) => void;
  OnActionOnlineUser: (data: IServerActionOnlineUser) => void;
  OnUserInsertedToChat: (data: IServerActionUserInserted) => void;
  CreateConnection: () => void;
  Auth: () => void;
  CloseConnection: () => void;
}

export interface IWebSocketUserMessage {
  Type: string;
  Content: {
    Chat_Id: number;
    Content: {
      content: string;
      documents: number[];
      type: string;
    };
    Token: string;
  };
}

export interface IWebSocketUserMessageRecieve {
  id: number;
  chat_id: number;
  message: {
    content: string;
    documents: number[];
    type: string;
  };
  author_id: number;
  author_name: string;
  author_login: string;
  time: number;
  type: string;
}

export interface IWebSocketSystemMessage {
  action: string;
  type_a: string;
  result?: string;
  chats?: number[];
  self?: boolean;
}

export interface IWebSocketSystemMessageAuth {
  action: string;
  result: string;
  type_a: string;
}

export interface IWebSocketSystemMessageOnline {
  action: string;
  chats: number[];
  self: boolean;
  type: string;
  type_a: string;
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
  type_a: string;
}

export enum OnlineUserAction {
  Reduce,
  Increase,
}

export interface IServerActionOnlineUser {
  Chats: number[];
  Self: boolean;
  Type: OnlineUserAction;
}

export interface IServerActionUserInserted {
  ChatID: number;
}
