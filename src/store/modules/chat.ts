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

  constructor(rootStore: IRootStore) {
    this.remoteAPI = rootStore.remoteAPI;
    this.rootStore = rootStore;
    this.webScoketConnection = rootStore.webScoketConnection;
    this.webScoketConnection.OnActionOnlineUser = this.newOnlineUser.bind(this);
    this.chats = [];
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
      this.rootStore.messagesStore.messages.clear();
      this.chats.forEach((v) => {
        this.rootStore.messagesStore.messages.set(v.ID, {
          allLoaded: false,
          messages: [],
        });
      });
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

  public clear() {
    this.chats = [];
    this.currentChat = null;
  }

  private newOnlineUser(data: IServerActionOnlineUser) {
    // Useless now
  }

}
