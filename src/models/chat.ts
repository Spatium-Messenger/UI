import { IMessage } from "./message";

export interface IChat {
  ID: number;
  Name: string;
  New: number;
  Online: number;
  AdminID: number;
  Delete: boolean;
}
