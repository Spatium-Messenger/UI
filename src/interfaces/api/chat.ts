export interface IAPIChat {
  Get: () => Promise<void>;
  Create: (type: string, name: string) => Promise<void>;
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
