import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppStore } from "src/interfaces/store";
import {IDocument} from "src/models/document";
import Document from "./item";
require("./styles.scss");

interface IDocumentsPanelProps {
  store?: {
    appStore: IAppStore;
  };
}

@inject("store")
@observer
export default class DocumentsPanel extends React.Component<IDocumentsPanelProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const chatID = (this.props.store.appStore.currentChat ? this.props.store.appStore.currentChat.ID : -1);
    const chatsInputData = this.props.store.appStore.chatsInputData;
    let documents: IDocument[] = [];
    if (chatsInputData.hasOwnProperty(chatID)) {
      documents = chatsInputData[chatID].documents;
    }
    return(
      <div className="documents-line">
        {documents.map((v, i) => <Document key={v.src.size + v.src.name + v.src.type + v.load} data={v}/>)}
      </div>
    );
  }
}
