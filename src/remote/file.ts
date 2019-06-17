import {IAPIFile} from "src/interfaces/api/file";
import { IDocumentUpload } from "src/models/document";
import { IAPIData, IAnswerError } from "src/interfaces/api";
import {TESTUPLOADSPEED} from "./test.config";
import APIClass, { IAPIClassCallProps } from "./remote.api.base";

const base = "/api/file/";
export default class APIFile extends APIClass implements IAPIFile {

  private data: IAPIData;
  private uploadFileURL: string;
  private deleteFileURL: string;
  private getImageURL: string;
  private getDownloadLink: string;
  constructor(data: IAPIData) {
      super(data);
      this.data = data;
      this.uploadFileURL = "/api/file/upload";
      this.deleteFileURL = "/api/file/delete";
      this.getImageURL = "/api/file/get";
      this.getDownloadLink  = "/api/file/link";
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
      const body = this.pack(file);
      xhr.upload.onprogress = (evt: ProgressEvent) => {
        progress(evt.loaded);
        if (this.data.Logs) {
            console.log("Uploading file: ", file.src.name + " is " + evt.loaded + "B/" + evt.total + "B");
        }
      };
      xhr.open("POST", this.data.URL + this.uploadFileURL, true);
      xhr.setRequestHeader("X-Auth-Token",  this.netData.Token);
      xhr.send(body);

      file.abortLoad = function() {
        xhr.abort();
      };

      xhr.onload = () => {
          if (xhr.readyState !== 4) {return; }
          const data: {file_id: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
              file.id = Number(data.file_id);
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
      file.id = Math.floor(Math.random() * (999)) + 1;
      answer(file, false);
    }

  public async Delete(file: IDocumentUpload): Promise<IAnswerError> {
      const message = super.GetDefaultMessage();
      message.uri = this.data.URL + base + `${file.id}/delete`;
      message.type = "DELETE";
      // message.payload = {
        // file_id: file.id,
      // };
      return  super.Send(message);
  }

  public async DeleteTest(file: IDocumentUpload): Promise<IAnswerError> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      result: "Success",
      type: "system",
    };
  }

  public GetImage(fileID: number): string {
    // const body: string = JSON.stringify({
      //   file_id: fileID,
      //   min: true,
      // });
    return this.data.URL + base + `${fileID}?min=true`;
    // const xhr: XMLHttpRequest = new XMLHttpRequest();
    // xhr.open("GET", this.data.URL + base + `${fileID}?min=true`, true);
    // xhr.setRequestHeader("X-Auth-Token",  this.netData.Token);
    // xhr.responseType = "arraybuffer";
    // xhr.send();

    // const imageBase64: string =  await new Promise((resolve) => {
    //   xhr.onload = () => {
    //     if (xhr.readyState !== 4) {return; }
    //     try {
    //       const response: {result: string} = JSON.parse(xhr.responseText);
    //       if (response.result === "Error") {
    //         resolve("Error");
    //       }
    //     } catch (e) {
    //       const blob = this.getBlob(xhr.response, "image/" + extension);
    //       const reader = new FileReader();
    //       reader.onload = (event: ProgressEvent) => {
    //         resolve((event.target as any).result);
    //       };
    //       reader.readAsDataURL(blob);
    //     }
    //   };
    //   xhr.onerror = () => {
    //     resolve("Error");
    //   };
    // });
    // return imageBase64;
  }

  public async Download(fileID: number): Promise<string> {
    const message: IAPIClassCallProps = super.GetDefaultMessage();
    message.uri =  base + `${fileID}/link`;
    message.type = "GET";
    // message.payload = {...message.payload,
    //                    file_id: fileID,
    // };
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

  private pack(file: IDocumentUpload): FormData {
      const formData = new FormData();
      formData.append("file", (file.src as any), file.src.name);
      formData.append("name", file.src.name);
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
