import { observable, action} from "mobx";
import {IMessagesStore, IChatsMessages} from "src/interfaces/store";
import { IRootStore } from "../interfeces";
import { IAPI, IAnswerError } from "src/interfaces/api";
import { IMessage } from "src/models/message";
import { IWebSocket } from "src/interfaces/web-socket";

export default class MessagesStore implements IMessagesStore {
  @observable public messages: Map<number, IChatsMessages>;
  private rootStore: IRootStore;
  private remoteApi: IAPI;
  private webSocketConnect: IWebSocket;

  constructor(rootStore: IRootStore, remoteAPI: IAPI, websocket: IWebSocket) {
    this.rootStore = rootStore;
    this.remoteApi = remoteAPI;
    this.webSocketConnect = websocket;
    this.webSocketConnect.OnMessage = this.newMessage.bind(this);
    this.messages = new Map<number, IChatsMessages>();
    this.messages.set(1, {
      messages: [
      //   {
      //     ID: 1,
      //     AuthorID: 2,
      //     AuthorName: "BorisBritva",
      //     Content: {
      //               Documents: [],
      //               Message: `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
      //                 when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      //            It has survived not only five centuries, but also the leap into electronic typesetting, remaining
      //                 essentially unchanged. It was popularised in the 1960s with the release
      //                 of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
      //                 publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
      //               Type: "u_msg"},
      //     ChatID: 1,
      //     Time: 1547649321,
      //  },
      //   {
      //     ID: 2,
      //     AuthorID: 1,
      //     AuthorName: "Alex228",
      //     Content: {
      //               Documents: [],
      //               Message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      //               Type: "u_msg"},
      //     ChatID: 1,
      //     Time: 1547648232,
      //  },
      ],
      allLoaded: false,
    });
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

  private newMessage(data: IMessage) {
    const chatMessagesInfo: IChatsMessages = this.messages.get(data.ChatID);
    chatMessagesInfo.messages = [...chatMessagesInfo.messages, data];
    this.messages.set(data.ChatID, chatMessagesInfo);
  }
}
