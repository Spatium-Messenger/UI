import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import ChatPreferencesUp from "./up";
import ChatPreferencesPeople from "./people";
import Loader from "src/ui/components/loader";
import { IChat } from "src/models/chat";
require("./styles.scss");

interface IChatPreferencesProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class ChatPreferences extends React.Component<IChatPreferencesProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    if (this.props.store.chatStore.currentChatID === -1) {
      return(<div/>);
    }
    const userID = this.props.store.userStore.data.ID;
    const chatID = this.props.store.chatStore.currentChatID;
    const messagesInfo = this.props.store.messagesStore.messages.get(chatID);
    const currentChat: IChat | null = this.props.store.chatStore.getChatData(chatID);
    if (!currentChat) {
      return(<div/>);
    }

    const classname = "chat-preferences" + (this.props.store.appStore.chatMenu ? "-open" : "-close");
    if (!messagesInfo || messagesInfo.loading) {
      return <div className={classname + "-loading"}>
              <div className="chat-preferences-loader">
                <Loader/>
              </div>
            </div>;
    }
    const up = (currentChat.AdminID === userID ? <ChatPreferencesUp /> : <div/>);
    return(
      <div className={classname}>
        {up}
        <ChatPreferencesPeople />
      </div>
    );
  }
}
