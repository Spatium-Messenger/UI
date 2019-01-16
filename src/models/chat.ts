import { IMessage } from "./message";

export interface IChat {
  ID: number;
  Name: string;
  LastMessage: IMessage;
  New: number;
}
