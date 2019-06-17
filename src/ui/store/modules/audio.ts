import { observable, action} from "mobx";
import { IAudioUpload } from "src/models/audio";
import { IAudioStore } from "src/interfaces/store";
import { IRootStore } from "../interfeces";
import { IAPI } from "src/interfaces/api";
import {startRecording, stopRecording, doneRecording} from "src/hard/voice-recording";
import { IMessageSend, IMessageType } from "src/models/message";
import { IWebSocket } from "src/interfaces/web-socket";

export default class AudioStoreModule implements IAudioStore {
  @observable public voiceRecording: boolean;
  @observable public voiceVolumes: number[];
  @observable public voiceMessages: Map<number, IAudioUpload>;
  @observable public recoredingStartedAt: Date;
  private remoteApi: IAPI;
  private rootStore: IRootStore;
  private webSocketConnect: IWebSocket;

  constructor(rootStore: IRootStore) {
    this.rootStore = rootStore;
    this.remoteApi = rootStore.remoteAPI;
    this.webSocketConnect = rootStore.webScoketConnection;
    this.voiceRecording = false;
    this.voiceVolumes = [];
    this.voiceMessages = new Map<number, IAudioUpload>();
    this.getLink = this.getLink.bind(this);
    this.sendToSocket = this.sendToSocket.bind(this);
  }

  @action
  public changeRecording(value: boolean) {
    // from 0.1 to 0.9
    const smooth = 0.5;
    if (value) {
      this.recoredingStartedAt = new Date();
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
        this.recoredingStartedAt = null;
        this.cancelVoiceRecording();
      });
    } else {
      this.recoredingStartedAt = null;
      stopRecording();
      return;
    }

    this.voiceRecording = value;
  }

  public async getLink(fileID: number): Promise<{link: string, timeoff: Date} | {result: string}> {
    const answer = await this.remoteApi.audio.GetLink(fileID);
    if (answer["result"] === "Error") {
      return {...answer, link: "", timeoff: new Date()};
    } else {
      // console.log(answer["link"]);

      return {
        link: this.remoteApi.data.URL + "/getFile/" + answer["link"] + "/",
        timeoff: new Date(answer["timeoff"] * 1000), // seconds to miliseconds for date constructor
      };
    }
    //
  }

  public AudioRendered(data: {blob: Blob, duration: number}) {
    if (!this.voiceRecording) {return; }
    this.voiceVolumes = [];
    const chatID = this.rootStore.chatStore.currentChatID;
    let message: IAudioUpload = this.voiceMessages.get(chatID);
    if (!message) {
      message = this.defaultAudioUpload();
      message.src = data;
      message.chatID = chatID;
    }
    if (message.load === 1) {return; }
    this.voiceMessages.set(chatID, message);
  }

  @action
  public stopRecording() {
    this.recoredingStartedAt = null;
    doneRecording(this.AudioRendered.bind(this));
  }

  @action
  public cancelVoiceRecording() {
    const chatID = this.rootStore.chatStore.currentChatID;
    const data: IAudioUpload = this.voiceMessages.get(chatID);
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

    let record = this.defaultAudioUpload();
    record.chatID = chatID;

    if (!this.voiceMessages.has(chatID)) {
      record.src =  await new Promise((reject) => {
        doneRecording((data: {blob: Blob, duration: number}) => {
          reject(data);
        });
      });
      // record.duration = record.src.duration;
    } else {
      if (this.voiceMessages.get(chatID).load === 1) { return; }
      record =  this.voiceMessages.get(chatID);
    }

    this.remoteApi.audio.Upload(
      record,
      this.rootStore.userStore.data.ID,
      this.sendToSocket,
      // (f: IAudioUpload, err: boolean) => {
      //
      // },
      (bytes: number) => {
        const nowRecord: IAudioUpload = this.voiceMessages.get(chatID);
        if (!nowRecord) {return; }
        nowRecord.uploaded = bytes;
        // nowRecord.load = 2;
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

  private defaultAudioUpload(): IAudioUpload {
    return {
      src: null,
      chatID: -1,
      load: 0,
      abortLoad: () => {/* */},
      del: false,
      uploaded: 0,
      fileID: -1,
      duration: 0,
    };
  }

  private sendToSocket(audio: IAudioUpload) {
    const message: IMessageSend = {
      AuthorID: this.rootStore.userStore.data.ID,
      AuthorName: this.rootStore.userStore.data.login,
      ChatID: audio.chatID,
      Content: {
        Type: IMessageType.User,
        Documents: [audio.fileID],
        Message: "",
      },
      ID: -1,
      Time: -1,
    };

    this.webSocketConnect.SendMessage(message);
    this.voiceMessages.delete(audio.chatID);
    this.voiceRecording = false;
  }

}
