import * as React from "react";
import { observer, inject } from "mobx-react";
import IMessageUnit from "./message";
import { IRootStore } from "src/store/interfeces";
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
    return(
      <div className="window__content">
        {/* <div> */}
          {messages.map((v, i) => <IMessageUnit data={v} key={i} userID={userID}/>)}
        {/* </div> */}
      </div>
    );
  }
}
