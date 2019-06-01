import { observable, action} from "mobx";
import {IInputStore,  IInputData} from "src/interfaces/store";
import { IDocumentUpload } from "src/models/document";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";

import { IWebSocket } from "src/interfaces/web-socket";
import {  IMessageType, IMessageSend } from "src/models/message";

export default class InputStoreModule implements IInputStore {
  @observable public chatsInputData: Map<number, IInputData>;
  private remoteApi: IAPI;
  private rootStore: IRootStore;
  private webSocketConnect: IWebSocket;

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore;
    this.remoteApi = rootStore.remoteAPI;
    this.webSocketConnect = rootStore.webScoketConnection;
    this.chatsInputData = new Map<number, IInputData>();
    this.chatsInputData.set(1, {
      documents: [],
      text: "",
    });
  }

  @action
  public uploadDocuments(docs: IDocumentUpload[]): void {
    // console.log("Upload:", docs);
    if (docs.length === 0) {return; }
    const chatID = docs[0].chatID;
    const inputData: IInputData = this.chatsInputData.get(chatID);
    // Find repetitions
    docs = docs.filter((v) => {
      let decision = true;
      inputData.documents.forEach((a) => {
        decision = (v.key === a.key ? false : true);
      });
      return decision;
    });

    const loaded = (file: IDocumentUpload, err: boolean) => {
      if (err) {
        return;
      }
      const data: IInputData = this.chatsInputData.get(file.chatID);
      data.documents.forEach((v) => {
        if (v.key === file.key) {
          v.load = 2;
          v.uploadedSize = file.src.size;
          v.id = file.id;
        }
      });
      this.chatsInputData.set(file.chatID, data);
    };

    const process = (file: IDocumentUpload, uploadedSize: number) => {
      const data: IInputData = this.chatsInputData.get(file.chatID);
      data.documents.forEach((v) => {
        if (v.key === file.key) {
          v.uploadedSize = uploadedSize;
        }
      });
      this.chatsInputData.set(file.chatID, data);
    };

    docs.forEach((v) => {
      this.remoteApi.file.Upload(v, loaded, (p: number) => {process(v, p); });
    });

    inputData.documents.push(...docs);
    this.chatsInputData.set(chatID, inputData);
  }

  @action
  public async deleteDocument(file: IDocumentUpload): Promise<void> {
    if (file.load === 2) {
      const succseDel = await this.remoteApi.file.Delete(file);
      if (!succseDel) {
        return;
      }
    } else {
      file.abortLoad();
    }

    const data: IInputData = this.chatsInputData.get(file.chatID);
    data.documents = data.documents.filter((v) => {
      if (v.key === file.key) {
       return false;
      }
      return true;
    });

    this.chatsInputData.set(file.chatID, data);
  }

  @action
  public setTextInput(text: string) {
    const chatID = this.rootStore.chatStore.currentChatID;
    const data: IInputData = this.chatsInputData.get(chatID);
    data.text = text;
    this.chatsInputData.set(chatID, data);
  }

  @action
  public async sendMessage() {
    const chatID = this.rootStore.chatStore.currentChatID;
    if (this.rootStore.audioStore.voiceRecording) {
      this.rootStore.audioStore.sendVoiceMessage(chatID);
    } else {
      const inputData: IInputData =  this.chatsInputData.get(chatID);
      const docs: number[] = [];
      try {
        inputData.documents.forEach((v: IDocumentUpload) => {
          if (v.del || v.load !== 2 || v.id === -1) {
            throw new Error("");
          } else {
            docs.push(v.id);
          }
        });
      } catch (e) {
        return;
      }

      const message: IMessageSend = {
        AuthorID: this.rootStore.userStore.data.ID,
        AuthorName: this.rootStore.userStore.data.login,
        ChatID: chatID,
        Content: {
          Type: IMessageType.User,
          Documents: docs,
          Message: inputData.text,
        },
        ID: -1,
        Time: -1,
      };

      this.webSocketConnect.SendMessage(message);
      this.chatsInputData.set(chatID, {
        documents: [],
        text: "",
      });
    }

  }

  public clear() {
    this.chatsInputData.clear();

  }

}
