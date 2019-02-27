import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppStore, IChatStore } from "src/interfaces/store";
import { IRootStore } from "src/store/interfeces";
import { ChatTypes } from "src/models/chat";
import languages from "src/language";
require("./styles.scss");

const backIcon = require("assets/left-arrow.svg");
const chatIcon = require("assets/envelope.svg");
const dialogIcon = require("assets/friends.svg");
const channelIcon = require("assets/megaphone.svg");
const moreIcon = require("assets/settings-work-tool.svg");
const closeIcon = require("assets/cancel.svg");

interface IWindowHeaderProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class WindowHeader extends React.Component<IWindowHeaderProps> {
  constructor(props) {
    super(props);
    this.openPreferences = this.openPreferences.bind(this);
  }

  public openPreferences() {
    this.props.store.appStore.changeChatMenu(!this.props.store.appStore.chatMenu);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang).messages.header;
    const chatID = this.props.store.chatStore.currentChatID;
    const chatData = this.props.store.chatStore.getChatData(chatID);
    if (chatData === null) {
      return(<div/>);
    }

    let right = moreIcon;
    if (this.props.store.appStore.chatMenu) {
      right = closeIcon;
    }
    let icon: string = chatIcon;
    let iconClassName: string = "window__header__name-icon-";
    switch (chatData.Type) {
      case ChatTypes.Channel:
        icon = channelIcon;
        iconClassName += "channel";
        break;
      case ChatTypes.Dialog:
        icon = dialogIcon;
        iconClassName += "dialog";
        break;
      default:
        iconClassName += "chat";
        break;
    }

    return(
      <div className="window__header">
        <div className="window__header__name">
          <div
            className={iconClassName}
            dangerouslySetInnerHTML={{__html: icon}}
          />
          <div className="window__header__name-labels">
            <div>{chatData.Name}</div>
            <div className="window__header__name-labels__online">
              <div/>
              <div>{chatData.Online + " " + lang.online}</div>
            </div>
          </div>
        </div>
        <div
          className="window__header__more"
          dangerouslySetInnerHTML={{__html: right}}
          onClick={this.openPreferences}
        />
      </div>
    );
  }
}
