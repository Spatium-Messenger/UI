import {IAPIFile} from "src/interfaces/api/file";
import { IDocumentUpload } from "src/models/document";
import { IAPIData } from "src/interfaces/api";
import {TESTUPLOADSPEED} from "./test.config";

export default class APIFile implements IAPIFile {

  private data: IAPIData;
  private uploadFileURL: string;
  private deleteFileURL: string;
  constructor(data: IAPIData) {
      this.data = data;
      this.uploadFileURL = "/api/user/uploadFile";
      this.deleteFileURL = "/api/user/deleteFile";
      if (this.data.Imitation) {
        this.Upload = this.UploadTest;
        this.Delete = this.DeleteTest;
      }
    }

  public async Upload(
      file: IDocumentUpload,
      answer: (file: IDocumentUpload, err: boolean) => void,
      progress: (uploadedSize: number) => void) {

      const xhr: XMLHttpRequest = new XMLHttpRequest();
      const body = this.pack(file, this.data.Token);
      xhr.upload.onprogress = (evt: ProgressEvent) => {
        progress(evt.loaded);
        if (this.data.Logs) {
          console.log("Uploading file: ", file.src.name + " is " + evt.loaded + "B/" + evt.total + "B");
        }
      };

      xhr.open("POST", this.data.IP + this.uploadFileURL, true);
      xhr.send(body);
      file.abortLoad = function() {
        xhr.abort();
      };

      await new Promise((resolve, reject) => {
        xhr.upload.onload = () => {
          const data: {FileId: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
              file.id = data.FileId;
              if (file.del) {answer(file, true); }
              answer(file, false);
            }
        };

        xhr.upload.onerror = () => {
          if (this.data.Logs) {
              console.log("Uploading file: " + file.src.name + " failed ");
          }
        };
      });

      answer(file, true);
    }

  public async UploadTest(
      file: IDocumentUpload,
      answer: (file: IDocumentUpload, err: boolean) => void,
      progress: (uploadedSize: number) => void) {
      let breakLoad = false;
      file.abortLoad = () => {
        breakLoad = true;
      };
      for (let i = 0; i < file.src.size; i += TESTUPLOADSPEED) {
        if (breakLoad) { return; }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        progress(i);
      }
      if (breakLoad) { return; }
      file.id = Math.floor(Math.random() * (999 - 1 + 1)) + 1;
      answer(file, false);
    }

  public async Delete(file: IDocumentUpload): Promise<boolean> {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", this.data.IP + this.deleteFileURL, true);
      xhr.send(JSON.stringify({Token: this.data.Token, FileID: file.id, FileLoadingKey: file.loadKey}));
      const answer: {result: string} = await new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) { return; }
          if (xhr.status === 200) {
            const data: {result: string} = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            if (this.data.Logs) {
              console.log("Deleting file: " + file.src.name + " failed ");
            }
            resolve({result: "Error"});
          }
        }.bind(this);
      });
      return (answer.result !== "Error" ? true : false);
    }

  public async DeleteTest(file: IDocumentUpload) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  private pack(file: IDocumentUpload, token: string): FormData {
      const formData = new FormData();
      formData.append("uploadfile", (file.src as any), file.src.name);
      formData.append("fileName", file.src.name);
      formData.append("token", token);
      formData.append("type", file.src.type);
      formData.append("ratio_size", (file.width / file.height as any));
      formData.append("chat_id", (file.chatID as any));
      return formData;
    }

}
