import { IAPIAudio } from "src/interfaces/api/audio";
import { IAudioMessage } from "src/models/audio";
import { IAPIData } from "src/interfaces/api";

import {TESTUPLOADSPEED} from "./test.config";

export default class APIAudio implements IAPIAudio {
  private data: IAPIData;
  private uploadPath: string;
  private getPath: string;
  private deletePath: string;
  private getAudioURL: string;
  constructor(data: IAPIData) {
    this.data = data;
    this.uploadPath = "/api/file/uploadFile";
    this.deletePath = "/api/file/deleteFile";
    this.getAudioURL = "/api/file/getFile";
    if (this.data.Imitation) {
      this.Upload = this.UploadTest;
      this.Delete = this.DeleteTest;
    }
  }

  public async Get(fileID: number): Promise<{duration: number, blob: Blob} | {result: string}> {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      const body: string = JSON.stringify({
        token: this.data.Token,
        file_id: fileID,
        min: false,
      });
      xhr.open("POST", this.data.URL + this.getAudioURL, true);
      xhr.responseType = "arraybuffer";
      xhr.send(body);
      const result: {duration: number, blob: Blob} | {result: string} = await new Promise((resolve) => {
        xhr.onload = () => {
          if (xhr.readyState !== 4) {return; }
          try {
            const response: {result: string} = JSON.parse(xhr.responseText);
            if (response.result === "Error") {
              resolve({result: "Error"});
            }
          } catch (e) {
            const blob = this.getBlob(xhr.response, "audio/wav");
            const audioData = xhr.response;

            const audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

            audioCtx.decodeAudioData(audioData, (buffer: AudioBuffer) => {
              resolve({blob, duration: buffer.duration});
            });
          }
        };
        xhr.onerror = () => {
          resolve({result: "Error"});
        };
      });
      return result;
  }

  public async Upload(
    file: IAudioMessage,
    userID: number,
    answer: (file: IAudioMessage, err: boolean) => void,
    progress: (uploadedSize: number) => void) {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      const body = this.pack(file, this.data.Token, userID);
      xhr.upload.onprogress = (evt: ProgressEvent) => {
        progress(evt.loaded);
        if (this.data.Logs) {
          console.log("Uploading audio message is " + evt.loaded + "B/" + evt.total + "B");
        }
      };

      xhr.open("POST", this.data.URL + this.uploadPath, true);
      xhr.send(body);
      file.abortLoad = function() {
        xhr.abort();
      };

      const error = await new Promise((resolve) => {
        xhr.onload = () => {
          if (xhr.readyState !== 4) {return; }
          const data: {FileId: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
              file.fileID = Number(data.FileId);
              if (file.del) {answer(file, true); }
              answer(file, false);
              resolve(false);
            }
        };

        xhr.onerror = () => {
          if (this.data.Logs) {
              console.log("Uploading audio message: failed ");
          }
          resolve(true);
        };
      });
      if (error) {
        answer(file, true);
      }
    }

  public async Delete(file: IAudioMessage): Promise<boolean> {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", this.data.URL + this.deletePath, true);
    xhr.send(JSON.stringify({Token: this.data.Token, FileID: file.fileID, FileLoadingKey: -1}));
    const answer: {result: string} = await new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) { return; }
          if (xhr.status === 200) {
            const data: {result: string} = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            if (this.data.Logs) {
              console.log("Deleting audio message: failed ");
            }
            resolve({result: "Error"});
          }
        }.bind(this);
      });
    return (answer.result !== "Error" ? true : false);
  }

  public async UploadTest(
    file: IAudioMessage,
    userID: number,
    answer: (file: IAudioMessage, err: boolean) => void,
    progress: (uploadedSize: number) => void) {
    const form = this.pack(file, this.data.Token, userID);
    if (this.data.Logs) {
      console.log("Audio message packed");
    }
    let breakLoad = false;
    file.abortLoad = () => {
      console.log("Aborted");
      breakLoad = true;
    };
    for (let i = 0; i < file.src.blob.size; i += TESTUPLOADSPEED) {
      if (breakLoad) { return; }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      progress(i);
    }
    if (breakLoad) { return; }
    file.fileID = Math.floor(Math.random() * (999 - 1 + 1)) + 1;
    answer(file, false);
    if (this.data.Logs) {
      console.log("Audio message sended");
    }
  }

  public async DeleteTest(file: IAudioMessage) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  private async squeeze(data: Blob, squeeze: boolean) {
    //
    // const reader: FileReader = new FileReader();
    // reader.readAsText(data);
    // let record: string | ArrayBuffer =  await new Promise((reject) => {
    //   reader.onload = () => {
    //     reject(reader.result);
    //   };
    // });
    // console.log(record);
    // const lz = new LZString();
    // record = (squeeze ? lz.compress((record as string)) : lz.decompress((record as string)));
    // const newBlob = new Blob([record], {type: `audio/wav`});
    // return newBlob;
  }

  private pack(file: IAudioMessage, token: string, userID: number): FormData {
    const fileName = file.src.blob.size + "_" + file.chatID + "_" + userID + ".wav";
    const formData = new FormData();
    formData.append("file", (file.src.blob as any), fileName);
    formData.append("name", fileName);
    formData.append("token", token);
    formData.append("type", "audio/wav");
    formData.append("ratio_size", (0 as any));
    formData.append("chat_id", (file.chatID as any));
    return formData;
  }

  private getBlob(data: string, extension: string): Blob {
    try {
        return new Blob([data], {type: extension});
    } catch (e) {
        const BlobBuilder = (window as any).WebKitBlobBuilder || (window as any).MozBlobBuilder;
        const bb = new BlobBuilder();
        bb.append(data);
        return bb.getBlob(extension);
    }
  }

}
