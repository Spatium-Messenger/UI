import { IChat, IChatUser } from "src/models/chat";
import { IAnswerError } from ".";
import { IFolk } from "src/models/user";

export enum ChatsTypes {
  Chat,
  Channel,
}

export interface IAPIChatsUser {
  ban: boolean;
  delete_last: number;
  id: number;
  login: string;
  name: string;
}

export interface IAPIUsersForAdd {
  id: number;
  login: string;
  name: string;
}

export interface IAPIChat {
  Get: () => Promise<IAnswerError | IChat[]>;
  Create: (type: ChatsTypes, name: string) => Promise<IAnswerError>;
  AddUsers: (IDs: number[], chatID: number) => Promise<IAnswerError>;
  GetUsers: (chatID: number) => Promise<IAnswerError | IChatUser[]>;
  GetUsersForAdd: (chatID: number, name: string) => Promise<IAnswerError |  IChatUser[]>;
  DeleteUsers: (chatID: number, IDs: number[]) => Promise<IAnswerError>;
  RecoveryUsers: (chatID: number, IDs: number[]) => Promise<IAnswerError>;
  GetChatSettings: (chatID: number) => Promise<void>;
  SetChatSettings: (chatID: number, name: string) => Promise<IAnswerError>;
  DeleteFromDialog: (chatID: number) => Promise<void>;
  RecoveryUserInDialog: (chatID: number) => Promise<void>;
  DeleteChatFromList: (chatID: number) => Promise<IAnswerError>;
  GetUsersForDialog: (name: string) => Promise<IFolk[]>;
  LeaveChat: (cahtID: number) => Promise<IAnswerError>;
}
