import { observable, action} from "mobx";
import {IMessagesStore, IChatsMessages} from "src/interfaces/store";
import { IRootStore } from "../interfeces";
import { IAPI, IAnswerError } from "src/interfaces/api";
import { IMessage } from "src/models/message";
import { IWebSocket } from "src/interfaces/web-socket";
import { ILocalStorage } from "src/interfaces/local-storage";
import { LZString } from "src/hard/string-compress";

export default class MessagesStore implements IMessagesStore {
  @observable public messages: Map<number, IChatsMessages>;
  private rootStore: IRootStore;
  private remoteApi: IAPI;
  private webSocketConnect: IWebSocket;
  private storage: ILocalStorage;
  private openLink: (link: string, name: string) => void;

  constructor(
      rootStore: IRootStore,
      openLink: (link: string, name: string) => void,
    ) {
    this.rootStore = rootStore;
    this.remoteApi = rootStore.remoteAPI;
    this.webSocketConnect = rootStore.webScoketConnection;
    this.storage = rootStore.storage;
    this.webSocketConnect.OnMessage = this.newMessage.bind(this);
    this.openLink = openLink;

    this.messages = new Map<number, IChatsMessages>();
    this.getImage = this.getImage.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
  }

  @action
  public async loadMessages(chatID: number) {
    const chatMessagesInfo: IChatsMessages = this.messages.get(chatID);
    const lastID: number = (chatMessagesInfo.messages.length === 0 ?
      0 :
      chatMessagesInfo.messages[chatMessagesInfo.messages.length - 1].ID);

    const newMessages: IAnswerError | IMessage[] = await this.remoteApi.messages.Get(lastID, chatID);
    if ((newMessages as IAnswerError).result !== "Error") {
      if ((newMessages as IMessage[]).length === 0) {
        chatMessagesInfo.allLoaded = true;
      } else {
        chatMessagesInfo.messages = [...chatMessagesInfo.messages, ...((newMessages as any) as IMessage[])];
      }
      this.messages.set(chatID, chatMessagesInfo);
    } else {
      console.log("Error", newMessages);
    }
  }

  public async getImage(fileID: number, ext: string): Promise<string> {
    let compressed = this.storage.Get(String(fileID));
    if (compressed !== "" && compressed !== null) {
      const decompressed = LZString.decompress(compressed);
      return decompressed;
    } else {
      const decompressed = await this.remoteApi.file.GetImage(fileID, ext);
      if (decompressed !== "Error" && decompressed !== "") {
        compressed = LZString.compress(decompressed);
        this.storage.Set(String(fileID), compressed);
        return decompressed;
      } else {
        return "Error";
      }
    }
  }

  public async downloadFile(fileID: number, name: string) {
    let link: string = await this.remoteApi.file.Download(fileID);
    if (link !== "Error") {
      link = this.remoteApi.data.URL + "/getFile/" + link + "/" + name;
      this.openLink(link, name);
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
}
