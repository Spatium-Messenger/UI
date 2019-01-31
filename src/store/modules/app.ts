import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IAppStore, IUser, IInputData} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import {IMessage} from "src/models/message";

export default class AppStoreModule implements IAppStore {
  @observable public user: IUser;
  @observable public chats: IChat[];
  @observable public chatsInputData: {[key: string]: IInputData};
  @observable public currentChat: IChat;

  constructor(rootStore: any) {
    this.user = {token: "", login: "", ID: 1};
    this.chats = [{
      ID: 1,
      LastMessage:
        {AuthorID: 1,
         AuthorName: "Alex228",
         Content: {Documents: [], Message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", Type: "u_msg"},
         chatID: 1,
         Time: 1547648232,
        },
      Name: "AlexChat",
      New: 2,
    }];
    this.currentChat = this.chats[0];
    this.chatsInputData = {
      1: {
        documents: [],
        text: "Hello",
      },
    };
  }

  @action
  public chooseChat(chat: IChat) {
    this.currentChat = chat;
  }

}
