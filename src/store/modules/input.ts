import { observable, action} from "mobx";
import {IInputStore,  IInputData} from "src/interfaces/store";
import { IDocumentUpload } from "src/models/document";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";

import {startRecording, stopRecording, doneRecording} from "src/hard/voice-recording";
import { IAudioMessage } from "src/models/audio";
import { IWebSocket } from "src/interfaces/web-socket";
import { IMessage, IMessageType } from "src/models/message";

export default class InputStoreModule implements IInputStore {
  @observable public chatsInputData: Map<number, IInputData>;
  @observable public voiceRecording: boolean;
  @observable public voiceVolumes: number[];
  @observable public voiceMessages: Map<number, IAudioMessage>;
  private remoteApi: IAPI;
  private rootStore: IRootStore;
  private webSocketConnect: IWebSocket;

  constructor(rootStore: IRootStore, remoteAPI: IAPI, websocket: IWebSocket) {
    this.rootStore = rootStore;
    this.remoteApi = remoteAPI;
    this.webSocketConnect = websocket;
    this.chatsInputData = new Map<number, IInputData>();
    this.chatsInputData.set(1, {
      documents: [],
      text: "",
    });
    this.voiceRecording = false;
    this.voiceVolumes = [];
    this.voiceMessages = new Map<number, IAudioMessage>();
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
  public changeRecording(value: boolean) {
    // from 0.1 to 0.9
    const smooth = 0.5;
    if (value) {
      startRecording((progress: any) => {
        if (!this.voiceRecording) {return; }
        const arr = [...this.voiceVolumes];
        // Why render more then 200 sticks?
        if (arr.length > 200) {
          arr.splice(0, 1);
        }

        arr.push(progress);
        // Because we can't. See below.
        if (arr.length < 2) {
          this.voiceVolumes = arr;
          return;
        }
        arr[arr.length - 1] =
        ((): number => {
          const first = arr[arr.length - 2];
          const sec = arr[arr.length - 1];
          let delta = (first - sec) / 2;
          delta = (delta > 0 ? delta : delta * -1);
          const min = Math.min(first, sec);
          return min + (delta * (1 + smooth));
        })();
        this.voiceVolumes = arr;
      });
    } else {
      stopRecording();
      return;
    }
    this.voiceRecording = value;
  }

  public AudioRendered(data: {blob: Blob, duration: number}) {
    if (!this.voiceRecording) {return; }
    this.voiceVolumes = [];
    const chatID = this.rootStore.chatStore.currentChat.ID;
    let message: IAudioMessage = this.voiceMessages.get(chatID);
    if (!message) {
      message = {
        src: data,
        chatID,
        load: 0,
        abortLoad: () => {
          //
        },
        del: false,
        uploaded: 0,
        fileID: -1,
      };
    }
    if (message.load === 1) {return; }
    this.voiceMessages.set(chatID, message);
  }

  @action
  public stopRecording() {
    doneRecording(this.AudioRendered.bind(this));
  }

  @action
  public setTextInput(text: string) {
    const chatID = this.rootStore.chatStore.currentChat.ID;
    const data: IInputData = this.chatsInputData.get(chatID);
    data.text = text;
    this.chatsInputData.set(chatID, data);
  }

  @action
  public cancelVoiceRecording() {
    const chatID = this.rootStore.chatStore.currentChat.ID;
    const data: IAudioMessage = this.voiceMessages.get(chatID);
    if (data.load === 1) {
      data.abortLoad();
    }
    this.voiceVolumes = [];
    this.voiceMessages.delete(this.rootStore.chatStore.currentChat.ID);
    this.voiceRecording = false;
  }

  @action
  public async sendMessage() {
    if (this.voiceRecording) {
      const chatID = this.rootStore.chatStore.currentChat.ID;
      this.voiceVolumes = [];

      let record: IAudioMessage = {
        src: null,
        chatID,
        load: 0,
        abortLoad: () => {
          //
        },
        del: false,
        uploaded: 0,
        fileID: -1,
      };

      if (!this.voiceMessages.has(chatID)) {
        record.src =  await new Promise((reject) => {
          doneRecording((data: {blob: Blob, duration: number}) => {
            reject(data);
          });
        });
      } else {
        if (this.voiceMessages.get(chatID).load === 1) { return; }
        record =  this.voiceMessages.get(chatID);
      }

      this.remoteApi.audio.Upload(
        record,
        this.rootStore.userStore.data.ID,
        function() {
          this.voiceMessages.delete(chatID);
          this.voiceRecording = false;
        }.bind(this),
        function(bytes: number) {
          const nowRecord: IAudioMessage = this.voiceMessages.get(chatID);
          if (!nowRecord) {return; }
          nowRecord.uploaded = bytes;
          this.voiceMessages.set(chatID, nowRecord);
        }.bind(this));

      record.load = 1;
      this.voiceMessages.set(chatID, record);
    } else {
      const chatID = this.rootStore.chatStore.currentChat.ID;
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

      const message: IMessage = {
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
    }
  }

  private getUpdateKey(oldKey: number) {
    const newValue = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    return (newValue === oldKey ? this.getUpdateKey(oldKey) : newValue);
  }

}
