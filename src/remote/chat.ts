import { IAPIChat, ChatsTypes, IAPIChatsUser, IAPIUsersForAdd } from "src/interfaces/api/chat";
import { IAPIData, IAnswerError } from "src/interfaces/api";
import APIClass, { IAPIClassCallProps } from "./remote.api.base";
import { IChat, IChatUser } from "src/models/chat";
import { IChatServer } from "./interfaces";
import { IFolk } from "src/models/user";

export class APIChat extends APIClass implements IAPIChat {
  private getChatsURL: string;
  private createChatURL: string;
  // private addUsersURL: string;
  private getUsersURL: string;
  // private getUsersForAddURL: string;
  private setSettingsURL: string;
  private deleteUsersURL: string;
  private recoveryUsersURL: string;
  // private deleteFromDialogURL: string;
  // private fullDeleteFromDialogURL: string;
  // private recoveryUserInDialogURL: string;
  private deleteChatFromListURL: string;
  private leaveChatURL: string;
  // private getUsersForDialogURL: string;
  private turnBackToChatURL: string;

  private invite: string;

  constructor(data: IAPIData) {
    super(data);
    const p: string = "/api/chat/";
    this.getChatsURL = "/api/user/chats";
    // this.getUsersForAddURL = p + "getUsersForAdd";
    this.createChatURL = p + "create";
    // this.addUsersURL = p + "invite";
    this.getUsersURL = p + "users";
    this.deleteUsersURL = p + "block";
    this.recoveryUsersURL = p + "unblock";
    // this.deleteFromDialogURL = p + "deleteFromDialog";
    // this.recoveryUserInDialogURL = p + "recoveryUserInDialog";
    this.deleteChatFromListURL = p + "deleteFromList";
    this.setSettingsURL = p + "settings";
    // this.getUsersForDialogURL = p + "getUsersForDialog";
    this.leaveChatURL = p + "leave";
    this.turnBackToChatURL = p + "return";

    this.invite = p + "invite";
  }

  public async Get(): Promise<IAnswerError | IChat[]> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.getChatsURL;
    message.type = "GET";
    const chatsAnswer: IAnswerError | IChatServer[] = await super.Send(message);
    const chats: IChat[] = [];
    if ((chatsAnswer as IAnswerError).result !== "Error") {
      (chatsAnswer as IChatServer[]).forEach((e: IChatServer) => {
        chats.push({
          ID: e.id,
          Name: e.name,
          New: e.view,
          AdminID: e.admin_id,
          Deleted: e.deleted,
          Banned: e.banned,
          Online: e.online,
          Type: e.type,
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

  public async AddUsers(IDs: number[], chatID: number): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.invite;
    message.payload = {...message.payload,
                       chat_id: chatID,
                       users: IDs};
    return super.Send(message);
  }

  public async GetUsers(chatID: number): Promise<IAnswerError | IChatUser[]> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri =  this.getUsersURL;
    message.payload = {...message.payload,
                       chat_id: chatID};
    const answer: IAnswerError | IAPIChatsUser[]  = await super.Send(message);
    if ((answer as IAnswerError).result !== "Error") {
      const users: IChatUser[] = (answer as IAPIChatsUser[]).map((u): IChatUser => {
       return {
         ID: u.id,
         Login: u.login,
         Blocked: u.ban,
         Delete: (u.delete_last !== 0),
         Name: u.name,
       };
      });
      return users;
    }
    return (answer as IAnswerError);
  }

  public async GetUsersForAdd(chatID: number, name: string): Promise<IAnswerError |  IChatUser[]> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.invite + `?chat_id=${chatID}&name=${name}`;
    message.type = "GET";
    message.payload = {...message.payload, chat_id: chatID, name};
    const answer: IAnswerError | {users: IAPIUsersForAdd[]} = await super.Send(message);
    if ((answer as IAnswerError).result !== "Error") {
      return (answer as {users: IAPIUsersForAdd[]}).users.map((u): IChatUser => {
        return {
          Blocked: false,
          Delete: false,
          ID: u.id,
          Login: u.login,
          Name: u.name,
        };
      });
    }
    return [];
    //
  }

  public async DeleteUsers(chatID: number, IDs: number[]): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.deleteUsersURL;
    message.payload = {...message.payload, ids: IDs, chat_id: chatID};
    return super.Send(message);
  }

  public async RecoveryUsers(chatID: number, IDs: number[]): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.recoveryUsersURL;
    message.payload = {...message.payload, ids: IDs, chat_id: chatID};
    return super.Send(message);
  }

  public async GetChatSettings(chatID: number): Promise<void> {
    //
  }

  public async SetChatSettings(chatID: number, name: string): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.setSettingsURL;
    message.payload = {...message.payload,
                       chat_id: chatID,
                       name};
    return super.Send(message);
  }

  public async DeleteFromDialog(chatID: number): Promise<void> {
    //
  }

  public async RecoveryUserInDialog(chatID: number): Promise<void> {
    //
  }

  public async LeaveChat(chatID: number): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.leaveChatURL;
    message.payload = {...message.payload,
                       chat_id: chatID};
    return super.Send(message);
  }

  public async TurnBackToChat(chatID: number): Promise<IAnswerError> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.turnBackToChatURL;
    message.payload = {...message.payload,
                       chat_id: chatID};
    return super.Send(message);
  }

  public async DeleteChatFromList(chatID: number): Promise<IAnswerError > {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.deleteChatFromListURL;
    message.payload = {...message.payload,
                       chat_id: chatID};
    return super.Send(message);
  }

  public async GetUsersForDialog(name: string): Promise<IFolk[]> {
    // const message: IAPIClassCallProps = super.GetDefaultMessage();
    // message.uri = this.getUsersForDialogURL;
    // message.payload = {...message.payload, name};
    // const answer: IAnswerError | IAPIUsersForAdd[] = await super.Send(message);
    // if ((answer as IAnswerError).result !== "Error") {
    //   return (answer as IAPIUsersForAdd[]).map((u): IFolk => {
    //     return {
    //       ID: u.id,
    //       Login: u.login,
    //       Name: u.name,
    //     };
    //   });
    // } else {
    //   console.error(answer);
    // }
    return [];
  }
}
