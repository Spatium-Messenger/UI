import * as React from "react";
import { observer, inject } from "mobx-react";
import { IMessage, IMessageType } from "src/models/message";
import DocMessage from "./doc";
require("./styles.scss");

interface IMessageUnitProps {
  data: IMessage;
  userID: number;
  lastMessageAuthorName: string;
}

export default class MessageUnit extends React.Component<IMessageUnitProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const mess = this.props.data;
    const authorsMessage = (mess.AuthorID === this.props.userID);
    const showAuthorName = (this.props.lastMessageAuthorName !== mess.AuthorName);
    if (mess.Content.Documents.length > 0) {
      console.log(mess.Content.Documents);
    }
    if (mess.Content.Type === IMessageType.System) {
      return (
      <div className={"system-message"}>
        <div className="system-message__content">{mess.AuthorName}{mess.Content.Message}</div>
      </div>
      );
    }
    return(
      // <div className={"message_" + (authorsMessage ? "my" : "alien")}>
      <div className={"message-wrapper"}>
        <div className="message">
          {(showAuthorName ? <div className="message__author">{mess.AuthorName}</div> : <div/>)}
          {mess.Content.Documents.map((d, i) => <DocMessage doc={d} key={i}/>)}
          <div className="message__content">{mess.Content.Message}</div>
        </div>
      </div>
    );
  }
}
