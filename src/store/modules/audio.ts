import { observable, action} from "mobx";
import { IAudioMessage } from "src/models/audio";
import { IAudioStore } from "src/interfaces/store";
import { IRootStore } from "../interfeces";
import { IAPI } from "src/interfaces/api";
import {startRecording, stopRecording, doneRecording} from "src/hard/voice-recording";
import { IMessageSend, IMessageType } from "src/models/message";
import { IWebSocket } from "src/interfaces/web-socket";

export default class AudioStoreModule implements IAudioStore {
  @observable public voiceRecording: boolean;
  @observable public voiceVolumes: number[];
  @observable public voiceMessages: Map<number, IAudioMessage>;
  private remoteApi: IAPI;
  private rootStore: IRootStore;
  private webSocketConnect: IWebSocket;

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore;
    this.remoteApi = rootStore.remoteAPI;
    this.webSocketConnect = rootStore.webScoketConnection;
    this.voiceRecording = false;
    this.voiceVolumes = [];
    this.voiceMessages = new Map<number, IAudioMessage>();
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
      }, (error: Error) => {
        this.cancelVoiceRecording();
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
    const chatID = this.rootStore.chatStore.currentChatID;
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
  public cancelVoiceRecording() {
    const chatID = this.rootStore.chatStore.currentChatID;
    const data: IAudioMessage = this.voiceMessages.get(chatID);
    if (data) {
      if (data.load === 1) {
        data.abortLoad();
      }
    }
    stopRecording();
    this.voiceVolumes = [];
    this.voiceMessages.delete(this.rootStore.chatStore.currentChatID);
    this.voiceRecording = false;
  }

  @action
  public async sendVoiceMessage(chatID: number) {
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
      (file: IAudioMessage, err: boolean) => {
        const message: IMessageSend = {
          AuthorID: this.rootStore.userStore.data.ID,
          AuthorName: this.rootStore.userStore.data.login,
          ChatID: file.chatID,
          Content: {
            Type: IMessageType.User,
            Documents: [file.fileID],
            Message: "",
          },
          ID: -1,
          Time: -1,
        };
        this.webSocketConnect.SendMessage(message);
        this.voiceMessages.delete(chatID);
        this.voiceRecording = false;
      },
      (bytes: number) => {
        const nowRecord: IAudioMessage = this.voiceMessages.get(chatID);
        if (!nowRecord) {return; }
        nowRecord.uploaded = bytes;
        this.voiceMessages.set(chatID, nowRecord);
      });

    record.load = 1;
    this.voiceMessages.set(chatID, record);
}

  public clear() {
    this.voiceRecording = false;
    this.voiceMessages.clear();
    this.voiceVolumes = [];
  }

}
