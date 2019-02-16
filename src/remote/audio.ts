import { IAPIAudio } from "src/interfaces/api/audio";
import { IAudioMessage } from "src/models/audio";
import { IAPIData } from "src/interfaces/api";
import {LZString} from "src/hard/compress";

import {TESTUPLOADSPEED} from "./test.config";

export default class APIAudio implements IAPIAudio {
  private data: IAPIData;
  private uploadPath: string;
  private getPath: string;
  private deletePath: string;
  constructor(data: IAPIData) {
    this.data = data;
    this.uploadPath = "/api/user/uploadFile";
    this.deletePath = "/api/user/deleteFile";
    if (this.data.Imitation) {
      this.Upload = this.UploadTest;
      this.Delete = this.DeleteTest;
    }
  }

  public async Get(ID: number) {
    //
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

      await new Promise((resolve, reject) => {
        xhr.upload.onload = () => {
          const data: {FileId: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
              file.fileID = data.FileId;
              if (file.del) {answer(file, true); }
              answer(file, false);
            }
        };

        xhr.upload.onerror = () => {
          if (this.data.Logs) {
              console.log("Uploading audio message: failed ");
          }
        };
      });

      answer(file, true);
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
    formData.append("uploadfile", (file.src.blob as any), fileName);
    formData.append("fileName", fileName);
    formData.append("token", token);
    formData.append("type", "audio/wav");
    formData.append("ratio_size", (0 as any));
    formData.append("chat_id", (file.chatID as any));
    return formData;
  }

}
