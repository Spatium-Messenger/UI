import {IAPIFile} from "src/interfaces/api/file";
import { IDocumentUpload } from "src/models/document";
import { IAPIData, IAnswerError } from "src/interfaces/api";
import {TESTUPLOADSPEED} from "./test.config";
import APIClass, { IAPIClassCallProps } from "./remote.api.base";

export default class APIFile extends APIClass implements IAPIFile {

  private data: IAPIData;
  private uploadFileURL: string;
  private deleteFileURL: string;
  private getImageURL: string;
  private getDownloadLink: string;
  constructor(data: IAPIData) {
      super(data);
      this.data = data;
      this.uploadFileURL = "/api/file/uploadFile";
      this.deleteFileURL = "/api/file/deleteFile";
      this.getImageURL = "/api/file/getFile";
      this.getDownloadLink  = "/api/file/getFileLink";
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
      xhr.open("POST", this.data.URL + this.uploadFileURL, true);
      xhr.send(body);

      file.abortLoad = function() {
        xhr.abort();
      };

      xhr.onload = () => {
          if (xhr.readyState !== 4) {return; }
          const data: {FileId: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
              file.id = Number(data.FileId);
              if (file.del) {answer(file, true); }
              answer(file, false);
            }
        };

      xhr.onerror = () => {
          if (this.data.Logs) {
              console.log("Uploading file: " + file.src.name + " failed ");
          }
        };

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

      xhr.open("POST", this.data.URL + this.deleteFileURL, true);
      xhr.send(JSON.stringify({token: this.data.Token, file_id: file.id, FileLoadingKey: file.loadKey}));
      const answer: {result: string} = await new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
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
        };
      });
      return (answer.result !== "Error" ? true : false);
    }

  public async DeleteTest(file: IDocumentUpload) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }

  public async GetImage(fileID: number, extension: string): Promise<string> {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    const body: string = JSON.stringify({
      token: this.data.Token,
      file_id: fileID,
      min: true,
    });
    xhr.open("POST", this.data.URL + this.getImageURL, true);
    xhr.responseType = "arraybuffer";
    xhr.send(body);

    const imageBase64: string =  await new Promise((resolve) => {
      xhr.onload = () => {
        if (xhr.readyState !== 4) {return; }
        try {
          const response: {result: string} = JSON.parse(xhr.responseText);
          if (response.result === "Error") {
            resolve("Error");
          }
        } catch (e) {
          const blob = this.getBlob(xhr.response, "image/" + extension);
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent) => {
            resolve((event.target as any).result);
          };
          reader.readAsDataURL(blob);
        }
      };
      xhr.onerror = () => {
        resolve("Error");
      };
    });
    return imageBase64;
  }

  public async Download(fileID: number): Promise<string> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri = this.getDownloadLink;
    message.payload = {...message.payload,
                       file_id: fileID,
    };
    const answer: IAnswerError | {link: string} = await super.Send(message);
    if ((answer as IAnswerError).result !== "Error") {
      return (answer as {link: string}).link;
    }
    return (answer as IAnswerError).result;
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

  private pack(file: IDocumentUpload, token: string): FormData {
      const formData = new FormData();
      formData.append("file", (file.src as any), file.src.name);
      formData.append("name", file.src.name);
      formData.append("token", token);
      formData.append("type", this.getExt(file.src.name).toLowerCase());
      formData.append("ratio_size", ((file.width / file.height as any) || 0));
      formData.append("chat_id", (file.chatID as any));
      formData.append("duration", (file.duration as any));
      return formData;
    }

  private getExt(name: string) {
      return name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1);
    }

}
