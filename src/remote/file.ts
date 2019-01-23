import {IAPIFile} from "src/interfaces/api/file";
import { IDocumentUpload } from "src/models/document";
import { IAPIData } from "src/interfaces/api";

// Upload speed B/s
const TESTUPLOADSPEED = 57344; // 56 Kb/s

export default class APIFile implements IAPIFile {
  private data: IAPIData;
  private uploadFileURL: string;
  constructor(data: IAPIData) {
    this.data = data;
    this.uploadFileURL = "/api/user/uploadFile";
    if (this.data.Imitation) {
      this.Upload = this.UploadTest;
    }
  }

  public async Upload(
    file: IDocumentUpload,
    answer: (file: IDocumentUpload, err: boolean) => void,
    progress: (uploadedSize: number) => void) {

    const xhr: XMLHttpRequest = new XMLHttpRequest();
    const body = this.zipData(file, this.data.Token);

    xhr.upload.addEventListener("progress", function(evt: ProgressEvent) {
      progress(evt.loaded);
      if (this.data.Logs) {
        console.log("Uploading file: ", file.src.name + " is " + evt.loaded + "B/" + evt.total + "B");
      }
    }.bind(this));

    xhr.open("POST", this.data.IP + this.uploadFileURL, true);
    xhr.send(body);

    await new Promise((resolve, reject) => {
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) { return; }
        if (xhr.status === 200) {
          const data: {FileId: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
            // file.load = 2;
            file.id = data.FileId;
            // file.uploadedSize = file.src.size;
            if (file.del) {answer(file, true); }
            answer(file, false);
          }
        } else {
          if (this.data.Logs) {
            console.log("Uploading file: " + file.src.name + " failed ");
          }
        }
      }.bind(this);
    });

    answer(file, true);
  }

  public async UploadTest(
    file: IDocumentUpload,
    answer: (file: IDocumentUpload, err: boolean) => void,
    progress: (uploadedSize: number) => void) {

    for (let i = 0; i < file.src.size; i += TESTUPLOADSPEED) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      progress(i);
    }
    // file.load = 2;
    file.id = Math.floor(Math.random() * (999 - 1 + 1)) + 1;
    // file.uploadedSize = file.src.size;
    answer(file, false);
  }

  private zipData(file: IDocumentUpload, token: string): FormData {
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
