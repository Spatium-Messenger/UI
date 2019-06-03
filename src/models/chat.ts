import { IMessage } from "./message";

export enum ChatTypes {
  Chat,
  Dialog,
  Channel,
}

export interface IChat {
  ID: number;
  Name: string;
  New: number;
  Online: number;
  AdminID: number;
  Deleted: boolean;
  Banned: boolean;
  Type: ChatTypes;
}

export interface IChatUser {
  ID: number;
  Login: string;
  Name: string;
  Blocked: boolean;
  Delete: boolean;
}
