import * as React from "react";
import { IChat } from "src/models/chat";
// import { IAppStore } from "src/interfaces/store";
require("./styles.scss");

interface ISideBarItemProps {
  chat: IChat;
  active: boolean;
  chooseChat: (chat: IChat) => void;
}

export default class SideBarItem extends React.Component<ISideBarItemProps> {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  public click() {
    this.props.chooseChat(this.props.chat);
  }

  public render() {
    const curChat = this.props.chat;
    return(
      <div
        className={(this.props.active ? "sidebar-item-active" : "sidebar-item")}
        onClick={this.click}
      >
        <div className="sidebar-item__avatar">
          {curChat.Name.substring(0, 2).toUpperCase()}
        </div>
        <div className="sidebar-item__info">
          <div className="sidebar-item__info__name">{curChat.Name}</div>
        </div>
        <div>
        {(curChat.New > 0 ? <div className="sidebar-item__additional__new">{curChat.New}</div> : <div/>)}
        </div>
      </div>
    );
  }
}
