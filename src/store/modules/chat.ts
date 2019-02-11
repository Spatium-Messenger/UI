import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import { IChatStore} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import {IMessage} from "src/models/message";
import { IAPI } from "src/interfaces/api";
import { IAnswerError } from "src/interfaces/api/chat";

export default class ChatStoreModule implements IChatStore {
  @observable public chats: IChat[];
  @observable public currentChat: IChat;
  private remoteAPI: IAPI;
  constructor(rootStore: any, remoteAPI: IAPI) {
    this.remoteAPI = remoteAPI;
    this.chats = [];
    // this.chats = [{
    //   ID: 1,
    //   LastMessage:
    //     {AuthorID: 1,
    //      AuthorName: "Alex228",
    //      Content: {Documents: [], Message: "Hi)", Type: "u_msg"},
    //      chatID: 1,
    //      Time: 1547648232,
    //     },
    //   Name: "AlexChat",
    //   New: 2,
    // }];
    this.currentChat = null;

  }

  @action
  public chooseChat(chat: IChat) {
    this.currentChat = chat;
  }

  @action
  public async loadChats() {
    const chats: IAnswerError | IChat[] = await this.remoteAPI.chat.Get();
    if ((chats as IAnswerError).result !== "Error") {
      this.chats = (chats as IChat[]);
    }
  }

}
