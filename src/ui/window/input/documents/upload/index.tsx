import * as React from "react";
import { observer, inject } from "mobx-react";
import Config from "src/config";
import { IDocumentUpload } from "src/models/document";
import { IAppStore, IInputStore } from "src/interfaces/store";
require("./styles.scss");

const attauchIcon: string = require("assets/clip.svg");

interface IDocumentsUploadProps {
  store?: {
    appStore: IAppStore;
    inputStore: IInputStore;
  };
}

@inject("store")
@observer
export default class DocumentsUpload extends React.Component<IDocumentsUploadProps> {
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.click = this.click.bind(this);
    this.getFiles = this.getFiles.bind(this);
  }

  public click() {
    this.inputRef.current.click();
  }

  public getFiles() {
    const inputFiles = this.inputRef.current.files;
    const sendFiles = [];

    for (const file of inputFiles) {
      if (file.size < Config.files.maxSize) {
        const uploadFile: IDocumentUpload = {
          chatID: this.props.store.appStore.currentChat.ID,
          load: 0,
          src: file,
          url: "",
          width: 0,
          height: 0,
          del: false,
          id: -1,
          key: file.name + file.size,
          uploadedSize: 0,
        };
        sendFiles.push(uploadFile);
      }
    }
    this.loadFiles(sendFiles);
  }

  public render() {
    return(
      <div>
        <div
          onClick={this.click}
          className="documents-upload__icon"
          dangerouslySetInnerHTML={{__html: attauchIcon}}
        />
        <form name="upload" className="documents-upload__form">
          <input
            type="file"
            name="myfile"
            ref={this.inputRef}
            className="documents-upload__input"
            multiple={true}
            onChange={this.getFiles}
          />
        </form>
      </div>
    );
  }
  public async loadFiles(files: IDocumentUpload[]): Promise<void> {
    const types = ["image/jpg", "image/jpeg", "image/png"];
    // forEach doesn't work with async/await...
    for (let i = 0; i < files.length; i++) {
      if (types.indexOf(files[i].src.type) === -1) {
        files[i].load = 1;
        continue;
      }
      files[i] = await this.pFileReader(files[i]);
    }
    this.props.store.inputStore.uploadDocuments(files);
  }

  private async pFileReader(file: IDocumentUpload): Promise<IDocumentUpload> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async function() {
        file = await this.readImage(file, reader.result);
        resolve(file);
      }.bind(this);
      reader.readAsDataURL((file.src as any));
    });

  }

  private readImage(file: IDocumentUpload, result: string | ArrayBuffer): Promise<IDocumentUpload> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = (result as any);
      img.onload = function() {
          file.load = 1;
          file.url = (result as string);
          file.width = img.width;
          file.height = img.height;
          resolve(file);
        }.bind(this);
    });
  }
}
