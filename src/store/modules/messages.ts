import { observable} from "mobx";
import {IMessagesStore, IChatsMessages} from "src/interfaces/store";
import { IRootStore } from "../interfeces";
import { IAPI } from "src/interfaces/api";

export default class MessagesStore implements IMessagesStore {
  @observable public messages: Map<number, IChatsMessages>;
  private rootStore: IRootStore;
  private remoteApi: IAPI;

  constructor(rootStore: IRootStore, remoteAPI: IAPI) {
    this.rootStore = rootStore;
    this.remoteApi = remoteAPI;
    this.messages = new Map<number, IChatsMessages>();
    this.messages.set(1, {
      messages: [
        {
          AuthorID: 2,
          AuthorName: "BorisBritva",
          Content: {
                    Documents: [],
                    Message: `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                      It has survived not only five centuries, but also the leap into electronic typesetting, remaining
                      essentially unchanged. It was popularised in the 1960s with the release
                      of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                      publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
                    Type: "u_msg"},
          chatID: 1,
          Time: 1547649321,
       },
        {
          AuthorID: 1,
          AuthorName: "Alex228",
          Content: {
                    Documents: [],
                    Message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                    Type: "u_msg"},
          chatID: 1,
          Time: 1547648232,
       },
    ],
      allLoaded: false,
      unreaded: 0,
    });
  }
}
