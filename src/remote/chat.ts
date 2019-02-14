import { IAPIChat, ChatsTypes } from "src/interfaces/api/chat";
import { IAPIData, IAnswerError } from "src/interfaces/api";
import APIClass, { IAPIClassCallProps } from "./remote.api.base";
import { IChat } from "src/models/chat";
import { IChatServer } from "./interfaces";

export class APIChat extends APIClass implements IAPIChat {
  private getChatsURL: string;
  private createChatURL: string;
  private addUsersURL: string;
  private getUsersURL: string;
  private getUsersForAddURL: string;
  private deleteUsersURL: string;
  private recoveryUsersURL: string;
  private deleteFromDialogURL: string;
  private fullDeleteFromDialogURL: string;
  private recoveryUserInDialogURL: string;
  private deleteChatFromList: string;

  constructor(data: IAPIData) {
    super(data);
    const p: string = "/api/chat/";
    this.getChatsURL = "/api/user/getMyChats";
    this.createChatURL = p + "create";
    this.addUsersURL = p + "addUsersInChat";
    this.getUsersURL = p + "getUsers";
    this.deleteUsersURL = p + "deleteUsers";
    this.recoveryUsersURL = p + "recoveryUsers";
    this.deleteFromDialogURL = p + "deleteFromDialog";
    this.recoveryUserInDialogURL = p + "recoveryUserInDialog";
    this.deleteChatFromList = p + "deleteFromList";
  }

  public async Get(): Promise<IAnswerError | IChat[]> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.getChatsURL;
    const chatsAnswer: IAnswerError | IChatServer[] = await super.Send(message);
    const chats: IChat[] = [];
    if ((chatsAnswer as IAnswerError).result !== "Error") {
      (chatsAnswer as IChatServer[]).forEach((e: IChatServer) => {
        chats.push({
          ID: e.id,
          Name: e.name,
          New: e.view,
          AdminID: e.admin_id,
          Delete: e.delete,
          Online: e.online,
        });
      });
      return chats;
    } else {
      return (chatsAnswer as IAnswerError);
    }

  }

  public async Create(type: ChatsTypes, name: string): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    let typeVal: string = "";
    switch (type) {
      case ChatsTypes.Channel:
        typeVal = "channel";
        break;
      case ChatsTypes.Chat:
        typeVal = "chat";
        break;
    }
    message.uri = this.createChatURL;
    message.payload = {...message.payload,
                       type: typeVal,
                       name,
    };
    const answer = await super.Send(message);
    return answer;
  }

  public async AddUsers(IDs: number[], chatID: number): Promise<void> {
    //
  }

  public async GetUsers(chatID: number): Promise<void> {
    //
  }

  public async GetUsersForAdd(chatID: number, name: string): Promise<void> {
    //
  }

  public async DeleteUsers(chatID: number, IDs: number[]): Promise<void> {
    //
  }

  public async RecoveryUsers(chatID: number, IDs: number[]): Promise<void> {
    //
  }

  public async GetChatSettings(chatID: number): Promise<void> {
    //
  }

  public async SetChatSettings(chatID: number, name: string): Promise<void> {
    //
  }

  public async DeleteFromDialog(chatID: number): Promise<void> {
    //
  }

  public async RecoveryUserInDialog(chatID: number): Promise<void> {
    //
  }

  public async DeleteChatFromList(chatID: number): Promise<void> {
    //
  }
}
