import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import { IChatStore, MODALS_ID} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import {IMessage} from "src/models/message";
import { IAPI, IAnswerError } from "src/interfaces/api";
import { ChatsTypes } from "src/interfaces/api/chat";
import { IRootStore } from "../interfeces";
import { IWebSocket, IServerActionOnlineUser } from "src/interfaces/web-socket";

export default class ChatStoreModule implements IChatStore {
  @observable public chats: IChat[];
  @observable public currentChat: IChat;
  private remoteAPI: IAPI;
  private rootStore: IRootStore;
  private webScoketConnection: IWebSocket;

  constructor(rootStore: IRootStore, remoteAPI: IAPI,  websocket: IWebSocket) {
    this.remoteAPI = remoteAPI;
    this.rootStore = rootStore;
    this.webScoketConnection = websocket;
    this.webScoketConnection.OnActionOnlineUser = this.newOnlineUser.bind(this);
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
    this.rootStore.messagesStore.loadMessages(chat.ID);
  }

  @action
  public async loadChats() {
    const chats: IAnswerError | IChat[] = await this.remoteAPI.chat.Get();
    if ((chats as IAnswerError).result !== "Error") {
      this.chats = (chats as IChat[]);
    }
  }

  @action
  public async createChat(name: string) {
    const answer: IAnswerError = await this.remoteAPI.chat.Create(ChatsTypes.Chat, name);
    console.log(answer);
    if (answer.result !== "Error") {
      this.rootStore.appStore.changeModal(MODALS_ID.NULL);
      this.loadChats();
    }
  }

  private newOnlineUser(data: IServerActionOnlineUser) {
    // Useless now
  }

}
