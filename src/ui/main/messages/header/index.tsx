import * as React from "react";
import { observer, inject } from "mobx-react";
import { IAppStore, IChatStore } from "src/interfaces/store";
import { IRootStore } from "src/store/interfeces";
require("./styles.scss");

const backIcon = require("assets/left-arrow.svg");
const moreIcon = require("assets/more.svg");

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
    if (this.props.store.chatStore.currentChat === null) {
      return(<div/>);
    }
    return(
      <div className="window__header">
        <div className="window__header__back" dangerouslySetInnerHTML={{__html: backIcon}}/>
        <div className="window__header__name">
          <div>{this.props.store.chatStore.currentChat.Name.substring(0, 2).toUpperCase()}</div>
          <div>{this.props.store.chatStore.currentChat.Name}</div>
        </div>
        <div
          className="window__header__more"
          dangerouslySetInnerHTML={{__html: moreIcon}}
          onClick={this.openPreferences}
        />
      </div>
    );
  }
}
