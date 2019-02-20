import { IMessage } from "./message";

export interface IChat {
  ID: number;
  Name: string;
  New: number;
  Online: number;
  AdminID: number;
  Delete: boolean;
}

export interface IChatUser {
  ID: number;
  Login: string;
  Name: string;
  Blocked: boolean;
  Delete: boolean;
}
