export interface IMessage {
  chatID: number;
  Content: IMessageContent;
  AuthorName: string;
  AuthorID: number;
  Time: number;
}

interface IMessageContent {
  Message: string;
  Documents: number[];
  Type: string;
}
