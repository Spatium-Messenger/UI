import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppStore, IMessagesStore, IChatStore } from "src/interfaces/store";
import IMessageUnit from "./message";
require("./styles.scss");

interface IWindowContentProps {
  store?: {
    appStore: IAppStore;
    messagesStore: IMessagesStore;
    chatStore: IChatStore;
  };
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
    const userID = this.props.store.appStore.user.ID;
    // console.log(messages);
    return(
      <div className="window__content">
        <div>
          {messages.map((v, i) => <IMessageUnit data={v} key={i} userID={userID}/>)}
        </div>
      </div>
    );
  }
}
