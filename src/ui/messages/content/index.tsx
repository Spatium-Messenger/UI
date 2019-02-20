import * as React from "react";
import { observer, inject } from "mobx-react";
import IMessageUnit from "./message";
import { IRootStore } from "src/store/interfeces";
import { IMessageType } from "src/models/message";
require("./styles.scss");

interface IWindowContentProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class WindowContent extends React.Component<IWindowContentProps> {

  constructor(props) {
    super(props);
  }
  public render() {
    const chatID = this.props.store.chatStore.currentChat.ID;
    const messages = this.props.store.messagesStore.messages.get(chatID).messages;
    const userID = this.props.store.userStore.data.ID;
    const messagesComponents: JSX.Element[] = messages.map((v, i) => {
      let lastMessageAuthorName: string = (i === 0 ? "" :  messages[i - 1].AuthorName);
      if (lastMessageAuthorName !== "") {
        if (messages[i - 1].Content.Type !==  IMessageType.User) {
          lastMessageAuthorName = "";
        }
      }

      return <IMessageUnit
        getAudio={this.props.store.messagesStore.getAudio}
        downloadFile={this.props.store.messagesStore.downloadFile}
        getImage={this.props.store.messagesStore.getImage}
        data={v}
        key={i}
        userID={userID}
        lastMessageAuthorName={lastMessageAuthorName}
      />; });

    return(
      <div className="window__content">
        <div>
          {messagesComponents}
        </div>
      </div>
    );
  }
}
