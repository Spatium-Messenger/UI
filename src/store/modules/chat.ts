import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import { IChatStore} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import {IMessage} from "src/models/message";
import { IAPI } from "src/interfaces/api";

export default class ChatStoreModule implements IChatStore {
  @observable public chats: IChat[];
  @observable public currentChat: IChat;
  private remoteAPI: IAPI;
  constructor(rootStore: any, remoteAPI: IAPI) {
    this.remoteAPI = remoteAPI;
    this.chats = [{
      ID: 1,
      LastMessage:
        {AuthorID: 1,
         AuthorName: "Alex228",
         Content: {Documents: [], Message: "Hi)", Type: "u_msg"},
         chatID: 1,
         Time: 1547648232,
        },
      Name: "AlexChat",
      New: 2,
    }];
    this.currentChat = this.chats[0];

  }

  @action
  public chooseChat(chat: IChat) {
    this.currentChat = chat;
  }

}
