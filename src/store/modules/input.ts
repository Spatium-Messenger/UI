import { observable, action, reaction} from "mobx";
// import { IAppStoreModule, IUser } from "../../../interfaces/app_state";
import {IInputStore, IUser, IInputData} from "src/interfaces/store";
import { IChat } from "src/models/chat";
import { IDocumentUpload } from "src/models/document";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";

export default class InputStoreModule implements IInputStore {

  @observable public chatsInputData: Map<number, IInputData>;
  @observable public voiseRecording: boolean;
  private remoteApi: IAPI;
  private rootStore: IRootStore;

  constructor(rootStore: IRootStore, remoteAPI: IAPI) {
    this.rootStore = rootStore;
    this.remoteApi = remoteAPI;
    this.chatsInputData = new Map<number, IInputData>();
    this.chatsInputData.set(1, {
      documents: [],
      text: "Hello",
    });
    this.voiseRecording = false;
  }

  @action
  public uploadDocuments(docs: IDocumentUpload[]): void {
    console.log("Upload:", docs);
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
  public changeRecording(value: boolean) {
    this.voiseRecording = value;
  }

  @action
  public setTextInput(text: string) {
    const chatID = this.rootStore.appStore.currentChat.ID;
    const data: IInputData = this.chatsInputData.get(chatID);
    data.text = text;
    this.chatsInputData.set(chatID, data);
  }
  private getUpdateKey(oldKey: number) {
    const newValue = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    return (newValue === oldKey ? this.getUpdateKey(oldKey) : newValue);
  }

}
