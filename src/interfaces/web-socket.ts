import { IMessage } from "src/models/message";

export interface IWebSocket {
  SendMessage: (message: IMessage) => void;
  OnMessage: (fn: (data: any) => void) => void;
  CreateConnection: () => void;
  Auth: () => void;
}

export interface IWebSocketUserMessage {
  Chat_Id: number;
  Content: {
    content: string;
    documents: number[];
    type: string;
  };
  Token: string;
}

export interface IWebSocketSystemMessage {

}
