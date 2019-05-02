import { observable, action} from "mobx";
import {IMessagesStore, IChatsMessages} from "src/interfaces/store";
import { IRootStore } from "../interfeces";
import { IAPI, IAnswerError } from "src/interfaces/api";
import { IMessage } from "src/models/message";
import {
  IWebSocket,
  IWebSocketSystemMessageUserInsertedToChat,
  IServerActionUserInserted,
} from "src/interfaces/web-socket";

export default class MessagesStore implements IMessagesStore {
  @observable public messages: Map<number, IChatsMessages>;
  private remoteApi: IAPI;
  private webSocketConnect: IWebSocket;

  constructor(
      rootStore: IRootStore,
    ) {
    this.remoteApi = rootStore.remoteAPI;
    this.webSocketConnect = rootStore.webScoketConnection;
    this.webSocketConnect.OnMessage = this.newMessage.bind(this);
    this.webSocketConnect.OnUserInsertedToChat = this.userInsertedToChat.bind(this);

    this.messages = new Map<number, IChatsMessages>();
  }

  @action
  public async loadMessages(chatID: number) {
    const chatMessagesInfo: IChatsMessages = this.messages.get(chatID);
    if (chatMessagesInfo.allLoaded) {
      return;
    }
    const lastID: number = (chatMessagesInfo.messages.length === 0 ?
      0 :
      chatMessagesInfo.messages[chatMessagesInfo.messages.length - 1].ID);
    chatMessagesInfo.loading = true;
    this.messages.set(chatID, chatMessagesInfo);
    const newMessages: IAnswerError | IMessage[] = await this.remoteApi.messages.Get(lastID, chatID);
    if ((newMessages as IAnswerError).result !== "Error") {
      if ((newMessages as IMessage[]).length < 80) {
        chatMessagesInfo.allLoaded = true;
      }
      chatMessagesInfo.messages = [...chatMessagesInfo.messages, ...((newMessages as any) as IMessage[])];
      chatMessagesInfo.loading = false;
      this.messages.set(chatID, chatMessagesInfo);
    } else {
      console.log("Error", newMessages);
    }
  }

  public clear() {
    this.messages.clear();
  }

  private newMessage(data: IMessage) {
    const chatMessagesInfo: IChatsMessages = this.messages.get(data.ChatID);
    chatMessagesInfo.messages = [...chatMessagesInfo.messages, data];
    this.messages.set(data.ChatID, chatMessagesInfo);
  }

  private userInsertedToChat(message: IServerActionUserInserted) {
    this.loadMessages(message.ChatID);
  }
}
