import * as React from "react";
import { observer, inject } from "mobx-react";
import TextArea from "./textarea";
import DocumentsPanel from "./documents/line";
import DocumentUpload from "./documents/upload";
import Voice from "./voice";
import Send from "./send";
import { IRootStore } from "src/store/interfeces";
require("./styles.scss");

const sendIcon: string = require("assets/email.svg");

interface IWindowInputProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class WindowInput extends React.Component<IWindowInputProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const chatID = this.props.store.chatStore.currentChatID;
    const messagesInfo = this.props.store.messagesStore.messages.get(chatID);
    if (!messagesInfo || messagesInfo.loading) {
      return <div className="window__input__wrapper-disable"/>;
    }
    return(
      <div className="window__input__wrapper">
        <div className="window__input__docs">
          <DocumentsPanel/>
        </div>
        <div className="window__input__main">
          <div className="window__input__buttons">
            <DocumentUpload/>
          </div>
          <Voice/>
          <TextArea/>
          <Send/>
        </div>
      </div>
    );
  }
}
