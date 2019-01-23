import {IAPIFile} from "src/interfaces/api/file";
import { IDocumentUpload } from "src/models/document";
import { IAPIData } from "src/interfaces/api";

export default class APIFile implements IAPIFile {
  private data: IAPIData;
  private uploadFileURL: string;
  constructor(data: IAPIData) {
    this.data = data;
    this.uploadFileURL = "/api/user/uploadFile";
  }

  public async Upload(
    file: IDocumentUpload,
    answer: (file: IDocumentUpload, err: boolean) => void,
    progress: (percentage: number) => void) {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    const body = this.zipData(file, this.data.Token);
    xhr.upload.addEventListener("progress", function(evt: ProgressEvent) {
      progress(evt.loaded / evt.total);
    });
    xhr.open("POST", this.data.IP + this.uploadFileURL, true);
    xhr.send(body);
    await new Promise((resolve, reject) => {
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) { return; }
        if (xhr.status === 200) {
          const data: {FileId: number, result: string} = JSON.parse(xhr.responseText);
          if (data.result !== "Error") {
            file.load = 2;
            file.id = data.FileId;
            if (file.del) {answer(file, true); }
            answer(file, false);
          }
        }
      };
    });
    answer(file, true);

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
