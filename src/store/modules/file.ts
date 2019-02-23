import { observable, action} from "mobx";
import {IFileStore} from "src/interfaces/store";
import { IAPI } from "src/interfaces/api";
import { IRootStore } from "../interfeces";
import { ILocalStorage } from "src/interfaces/local-storage";
import { LZString } from "src/hard/string-compress";

export default class FileStoreModule implements IFileStore {
  @observable public audioBuffers: Map<string, {el: HTMLAudioElement, d: number}>;
  private remoteApi: IAPI;
  private rootStore: IRootStore;
  // private webSocketConnect: IWebSocket;
  private storage: ILocalStorage;
  private openLink: (link: string, name: string) => void;

  constructor(
      rootStore: IRootStore,
      openLink: (link: string, name: string) => void,
    ) {
    this.remoteApi = rootStore.remoteAPI;
    this.storage = rootStore.storage;
    this.audioBuffers = new Map<string, {el: HTMLAudioElement, d: number}>();
    this.getAudio = this.getAudio.bind(this);
    this.getImage = this.getImage.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.getCacheSize = this.getCacheSize.bind(this);

    this.openLink = openLink;
  }

  public async getAudio(fileID: number): Promise<{duration: number, blob: Blob} | {result: string}> {
    return this.remoteApi.audio.Get(fileID);
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

  public getCacheSize(): string {
    return this.storage.Size();
  }

  public clearCache() {
    this.storage.Clear();
  }

}
