export interface IMessage {
  ID: number;
  ChatID: number;
  Content: IMessageContent;
  AuthorName: string;
  AuthorID: number;
  Time: number;
}

interface IMessageContent {
  Message: string;
  Documents: number[];
  Type: IMessageType;
}

export enum IMessageType {
  User,
  System,
}
