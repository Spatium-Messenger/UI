export interface IMessage {
  ID: number;
  ChatID: number;
  Content: IMessageContent;
  AuthorName: string;
  AuthorLogin: string;
  AuthorID: number;
  Time: number;
}

export interface IMessageSend {
  ID: number;
  ChatID: number;
  Content: {
    Message: string;
    Documents: number[];
    Type: IMessageType;
  };
  AuthorName: string;
  AuthorID: number;
  Time: number;
}

interface IMessageContent {
  Message: string;
  Documents: IMessageContentDoc[];
  Type: IMessageType;
  Command: number;
}

export interface IMessageContentDoc {
  ID: number;
  Name: string;
  Ratio: number;
  Size: number;
  Path: string;
  AdditionalContentLoaded: boolean;
}

export enum IMessageType {
  User,
  System,
}

export enum IMessageSystemCommands {
  UserInsertedInChat = 1,
  UserCreatedChat,
  UserInsertedToChannel,
  UserCreatedChannel,
}
