import { observable, action} from "mobx";
import { IChatStore, MODALS_ID, OnlineUserAction} from "src/interfaces/store";
import { IChat, IChatUser } from "src/models/chat";
import { IAPI, IAnswerError } from "src/interfaces/api";
import { ChatsTypes } from "src/interfaces/api/chat";
import { IRootStore } from "../interfeces";
import { IWebSocket, IServerActionOnlineUser } from "src/interfaces/web-socket";
import { IFolk } from "src/models/user";

export default class ChatStoreModule implements IChatStore {
  @observable public chats: IChat[];
  @observable public currentChatID: number;
  @observable public users: Map<number, IChatUser[]>;
  @observable public usersForDialog: IFolk[];
  @observable public loading: boolean;
  private remoteAPI: IAPI;
  private rootStore: IRootStore;
  private webScoketConnection: IWebSocket;

  constructor(rootStore: IRootStore) {
    this.remoteAPI = rootStore.remoteAPI;
    this.rootStore = rootStore;
    this.webScoketConnection = rootStore.webScoketConnection;
    this.webScoketConnection.OnActionOnlineUser = this.newOnlineUser.bind(this);
    this.webScoketConnection.OnUserInsertedToChat = this.userInsertedInChat.bind(this);
    this.webScoketConnection.OnClosed = this.onlineNullabel.bind(this);
    this.chats = [];
    this.usersForDialog = [];
    this.currentChatID = 1;
    this.users = new Map<number, IChatUser[]>();
    this.loading = false;

  }

  @action
  public chooseChat(chat: IChat) {
    this.currentChatID = chat.ID;
    this.getChatUsers();
    this.rootStore.messagesStore.loadMessages(chat.ID);

  }

  @action
  public async loadChats() {
    this.loading = true;
    const chats: IAnswerError | IChat[] = await this.remoteAPI.chat.Get();
    let loadCurrentChatMessages = false;
    if ((chats as IAnswerError).result !== "Error") {
      this.rootStore.messagesStore.messages.clear();
      (chats as IChat[]).forEach((v) => {
        if (v.ID === this.currentChatID) {
          loadCurrentChatMessages = true;
          this.rootStore.messagesStore.messages.set(v.ID, {
            allLoaded: false,
            messages: [],
            loading: true,
          });
        } else {
          this.rootStore.messagesStore.messages.set(v.ID, {
            allLoaded: false,
            messages: [],
            loading: false,
          });
        }
        this.rootStore.inputStore.chatsInputData.set(v.ID, {
          documents: [],
          text: "",
        });

      });
      this.chats = (chats as IChat[]);
      this.loading  = false;
      if (loadCurrentChatMessages) {
        this.rootStore.messagesStore.loadMessages(this.currentChatID);
        this.getChatUsers();
      } else {
        this.currentChatID = -1;
      }

    }
  }

  public getChatData(id: number): IChat | null {
    let final: IChat = null;
    this.chats.forEach((c) => {
      if (final != null) {return; }
      if (c.ID === id) {
        final = c;
      }
    });
    return final;
  }

  @action
  public async createChat(name: string) {
    const answer: IAnswerError = await this.remoteAPI.chat.Create(ChatsTypes.Chat, name);
    if (answer.result !== "Error") {
      this.rootStore.appStore.changeModal(MODALS_ID.NULL);
      await this.pureLoadChats();

    } else {
      console.error(answer);
    }
  }

  @action
  public async createChannel(name: string) {
    const answer: IAnswerError = await this.remoteAPI.chat.Create(ChatsTypes.Channel, name);
    if (answer.result !== "Error") {
      this.rootStore.appStore.changeModal(MODALS_ID.NULL);
      this.loadChats();
    }
  }

  @action
  public async getChatUsers() {
    const chatID = this.currentChatID;
    const answer: IAnswerError | IChatUser[] = await this.remoteAPI.chat.GetUsers(chatID);
    if ((answer as IAnswerError).result !== "Error") {
      this.users.set(chatID, (answer as IChatUser[]));
    } else {
      console.log("getChatUsers fail");
    }
  }

  @action
  public async getUsersForAdd(name: string): Promise<IAnswerError | IChatUser[]> {
    const chatID = this.currentChatID;
    const answer: IAnswerError | IChatUser[] = await this.remoteAPI.chat.GetUsersForAdd(chatID, name);
    if ((answer as IAnswerError).result !== "Error") {
      return (answer as IChatUser[]);
    }
    return [];
  }

  @action
  public async addUserToChat(userID: number): Promise<IAnswerError> {
    const chatID = this.currentChatID;
    return this.remoteAPI.chat.AddUsers([userID], chatID);
  }

  @action
  public async findUsersForDialog(name: string) {
    if (name === "") {
      this.usersForDialog = [];
      return;
    }
    const answer: IFolk[] = await this.remoteAPI.chat.GetUsersForDialog(name);
    this.usersForDialog = answer;
  }

  @action
  public async setChatName(name: string) {
    const chatID = this.currentChatID;
    const answer: IAnswerError =  await this.remoteAPI.chat.SetChatSettings(chatID, name);
    if (answer.result !== "Error") {
      // this.loadChats();
      this.chats = this.chats.map((v) => {
        if (v.ID === chatID) {
          v.Name = name;
        }
        return v;
      });
    } else {
      console.log("setChatName", answer);
    }
  }

  @action
  public async blockUser(userID: number) {
    const answer = await this.remoteAPI.chat.DeleteUsers(this.currentChatID, [userID]);
    if (answer.result === "Error") {
      console.error(answer);
    } else {
      this.getChatUsers();
    }
  }

  @action
  public async unblockUser(userID: number) {
    const answer = await this.remoteAPI.chat.RecoveryUsers(this.currentChatID, [userID]);
    if (answer.result === "Error") {
      console.error(answer);
    } else {
      this.getChatUsers();
    }
  }

  @action
  public async deleteChatFromList(chatID: number) {
    const answer: IAnswerError = await this.remoteAPI.chat.DeleteChatFromList(chatID);
    if (answer.result !== "Error") {
      this.loadChats();
    } else {
      console.error(answer);
    }
  }

  @action
  public async leaveChat(chatID: number) {
    const answer: IAnswerError = await this.remoteAPI.chat.LeaveChat(chatID);
    if (answer.result !== "Error") {
      this.pureLoadChats();
    } else {
      console.error(answer);
    }
  }

  @action
  public async turnBackToChat(chatID: number) {
    const answer: IAnswerError = await this.remoteAPI.chat.TurnBackToChat(chatID);
    if (answer.result !== "Error") {
      this.pureLoadChats();
    } else {
      console.error(answer);
    }
  }

  public clear() {
    this.chats = [];
    this.currentChatID = -1;
    this.users.clear();
  }

  private newOnlineUser(chats: number[], w: OnlineUserAction) {
    console.log("NewOnlineUser - ", chats);
    chats.forEach((v) => {
      this.chats.forEach((c) => {
        if (v === c.ID) {
          (w === OnlineUserAction.Increase ?
          c.Online++ :
          (c.Online > 0 ? c.Online-- : c.Online = c.Online));
        }
      });
    });
  }

  private onlineNullabel() {
      this.chats.forEach((c) => {
        c.Online = 0;
      });
  }

  private userInsertedInChat() {
    this.pureLoadChats();
  }

  private async pureLoadChats() {
    const chats: IAnswerError | IChat[] = await this.remoteAPI.chat.Get();
    if ((chats as IAnswerError).result !== "Error") {
      this.chats = (chats as IChat[]);
    }
    this.chats.forEach((v) => {
      if (!this.rootStore.messagesStore.messages.get(v.ID)) {
        this.rootStore.messagesStore.messages.set(v.ID, {
          allLoaded: false,
          messages: [],
          loading: false,
        });
        this.rootStore.inputStore.chatsInputData.set(v.ID, {
          documents: [],
          text: "",
        });
      }
    });
  }

}
