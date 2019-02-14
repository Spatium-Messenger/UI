import { IMessage } from "src/models/message";

export interface IWebSocket {
  SendMessage: (message: IMessage) => void;
  OnMessage: (fn: (data: any) => void) => void;
  CreateConnection: () => void;
}

export interface IWebSocketUserMessage {

}

export interface IWebSocketSystemMessage {

}
