import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IAppStore, IUser} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import {IMessage} from "src/models/message";

export default class AppStoreModule implements IAppStore {
  @observable public user: IUser;
  @observable public chats: IChat[];
  @observable public messages: {[key: string]: IMessage[]};
  @observable public currentChat: IChat;

  constructor(rootStore: any) {
    this.user = {token: "", login: ""};
    this.chats = [{
      ID: 1,
      LastMessage:
        {Author_ID: "1",
         Author_Name: "Alex228",
         Content: {Documents: [], Message: "Hi", Type: "u_msg"},
         chatId: 1,
         Time: 1547648232,
        },
      Name: "AlexChat",
      New: 2,
    }];
    this.messages = {};
    this.currentChat = this.chats[0];
  }

  @action
  public chooseChat(chat: IChat) {
    this.currentChat = chat;
  }

}
