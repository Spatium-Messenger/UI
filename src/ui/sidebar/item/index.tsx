import * as React from "react";
import { IChat } from "src/models/chat";
import { IAppStore } from "src/interfaces/store";
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
          {curChat.LastMessage.Author_Name.substring(0, 2).toUpperCase()}
        </div>
        <div className="sidebar-item__info">
          <div className="sidebar-item__info__name">{curChat.Name}</div>
          <div className="sidebar-item__info__lastmessage">
            {curChat.LastMessage.Author_Name + ": " + curChat.LastMessage.Content.Message}
          </div>
        </div>
        <div className="sidebar-item__additional">
          <div className="sidebar-item__additional__time">
            {this.getTime(curChat.LastMessage.Time)}
          </div>
          {(curChat.New > 0 ? <div className="sidebar-item__additional__new">{curChat.New}</div> : <div/>)}
        </div>
      </div>
    );
  }

  private getTime(timestamp: number): string {
    const d = new Date();
    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    const gmtHours = -d.getTimezoneOffset() / 60;

    const now = new Date();

    const then = new Date(1970, 0, 1); // Epoch

    then.setSeconds(timestamp + gmtHours * 60 * 60);

    const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
              "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    let final = "";
    if (now.getDay() === then.getDay() &&
         now.getMonth() === then.getMonth() &&
         now.getFullYear() === then.getFullYear()) {
      const minutes = (then.getMinutes() < 10) ? "0" + then.getMinutes() : then.getMinutes();
      const hours = (then.getHours() < 10) ? "0" + then.getHours() : then.getHours();
      final = hours + ":" + minutes;
    } else if (now.getMonth() === then.getMonth() && now.getFullYear() === then.getFullYear()) {
      final = then.getDate() + " " + monthNames[then.getMonth()];
    } else {
      final = "" + then.getFullYear();
    }
    return final;
    }
}
