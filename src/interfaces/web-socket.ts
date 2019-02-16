import { IMessage } from "src/models/message";

export interface IWebSocket {
  SendMessage: (message: IMessage) => void;
  OnMessage: (fn: (data: any) => void) => void;
  OnAction: (fn: (data: any) => void) => void;
  CreateConnection: () => void;
  Auth: () => void;
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

export interface IWebSocketUserMessageSend {
  type: string;
  Content: {
    content: string;
    documents: number[];
    type: string;
  };
}

export interface IWebSocketSystemMessage {
  action: string;
  type_a: string;
  result?: string;
  chats?: number[];
  self?: boolean;
}
