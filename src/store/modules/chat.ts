import { observable, action} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import { IChatStore, MODALS_ID} from "src/interfaces/store";
import { IChat, IChatUser } from "src/models/chat";
import {IMessage} from "src/models/message";
import { IAPI, IAnswerError } from "src/interfaces/api";
import { ChatsTypes } from "src/interfaces/api/chat";
import { IRootStore } from "../interfeces";
import { IWebSocket, IServerActionOnlineUser } from "src/interfaces/web-socket";

export default class ChatStoreModule implements IChatStore {
  @observable public chats: IChat[];
  @observable public currentChat: IChat;
  @observable public users: Map<number, IChatUser[]>;
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
    this.users = new Map<number, IChatUser[]>();

  }

  @action
  public chooseChat(chat: IChat) {
    this.currentChat = chat;
    this.getChatUsers();
    this.rootStore.messagesStore.loadMessages(chat.ID);

  }

  @action
  public async loadChats() {
    const chats: IAnswerError | IChat[] = await this.remoteAPI.chat.Get();
    if ((chats as IAnswerError).result !== "Error") {
      this.rootStore.messagesStore.messages.clear();
      (chats as IChat[]).forEach((v) => {
        this.rootStore.messagesStore.messages.set(v.ID, {
          allLoaded: false,
          messages: [],
        });
        this.rootStore.inputStore.chatsInputData.set(v.ID, {
          documents: [],
          text: "",
        });
      });
      // console.log(this.rootStore.messagesStore.messages);
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

  @action
  public async getChatUsers() {
    const chatID = this.currentChat.ID;
    const answer: IAnswerError | IChatUser[] = await this.remoteAPI.chat.GetUsers(chatID);
    if ((answer as IAnswerError).result !== "Error") {
      this.users.set(chatID, (answer as IChatUser[]));
    } else {
      console.log("getChatUsers fail");
    }
  }

  @action
  public async getUsersForAdd(name: string): Promise<IAnswerError | IChatUser[]> {
    const chatID = this.currentChat.ID;
    const answer: IAnswerError | IChatUser[] = await this.remoteAPI.chat.GetUsersForAdd(chatID, name);
    if ((answer as IAnswerError).result !== "Error") {
      return (answer as IChatUser[]);
    }
    return [];
  }

  @action
  public async addUserToChat(userID: number): Promise<IAnswerError> {
    const chatID = this.currentChat.ID;
    return this.remoteAPI.chat.AddUsers([userID], chatID);
  }

  public clear() {
    this.chats = [];
    this.currentChat = null;
    this.users.clear();
  }

  private newOnlineUser(data: IServerActionOnlineUser) {
    // Useless now
  }

}
