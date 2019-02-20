import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/store/interfeces";
import ChatPreferencesUp from "./up";
import ChatPreferencesPeople from "./people";
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
    if (!this.props.store.chatStore.currentChat) {
      return(<div/>);
    }
    const classname = "chat-preferences" + (this.props.store.appStore.chatMenu ? "-open" : "-close");
    return(
      <div className={classname}>
        <ChatPreferencesUp />
        <ChatPreferencesPeople />
      </div>
    );
  }
}
