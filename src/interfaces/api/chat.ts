import { IChat } from "src/models/chat";
import { IAnswerError } from ".";

export enum ChatsTypes {
  Chat,
  Channel,
}

export interface IAPIChat {
  Get: () => Promise<IAnswerError | IChat[]>;
  Create: (type: ChatsTypes, name: string) => Promise<IAnswerError>;
  AddUsers: (IDs: number[], chatID: number) => Promise<void>;
  GetUsers: (chatID: number) => Promise<void>;
  GetUsersForAdd: (chatID: number, name: string) => Promise<void>;
  DeleteUsers: (chatID: number, IDs: number[]) => Promise<void>;
  RecoveryUsers: (chatID: number, IDs: number[]) => Promise<void>;
  GetChatSettings: (chatID: number) => Promise<void>;
  SetChatSettings: (chatID: number, name: string) => Promise<void>;
  DeleteFromDialog: (chatID: number) => Promise<void>;
  RecoveryUserInDialog: (chatID: number) => Promise<void>;
  DeleteChatFromList: (chatID: number) => Promise<void>;
}
