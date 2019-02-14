import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppStore, IInputData, IInputStore, IChatStore } from "src/interfaces/store";
import {IDocument, IDocumentUpload} from "src/models/document";
import Document from "./item";
import { IRootStore } from "src/store/interfeces";
require("./styles.scss");

interface IDocumentsPanelProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class DocumentsPanel extends React.Component<IDocumentsPanelProps> {
  constructor(props) {
    super(props);
    this.deleteFile = this.deleteFile.bind(this);
  }

  public deleteFile(file: IDocumentUpload) {
    this.props.store.inputStore.deleteDocument(file);
  }

  public render() {
    const chatID = (this.props.store.chatStore.currentChat ? this.props.store.chatStore.currentChat.ID : -1);
    const chatsInputData = this.props.store.inputStore.chatsInputData;
    let documents: IDocumentUpload[] = [];
    if (chatsInputData.has(chatID)) {
      documents = chatsInputData.get(chatID).documents;
    }
    const docsLine = documents.map((v, i) =>
     <Document
      deleteFile={this.deleteFile}
      key={v.key + v.uploadedSize}
      data={v}
     />);
    return(
      <div className="documents-line">
        {docsLine}
      </div>
    );
  }
}
