export interface IMessage {
  ID: number;
  ChatID: number;
  Content: IMessageContent;
  AuthorName: string;
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
}

export interface IMessageContentDoc {
  ID: number;
  Name: string;
  RatioSize: number;
  Size: number;
  Path: string;
  AdditionalContentLoaded: boolean;
}

export enum IMessageType {
  User,
  System,
}
