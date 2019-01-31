import * as React from "react";
import { observer, inject } from "mobx-react";
import { IMessage } from "src/models/message";
require("./styles.scss");

interface IMessageUnitProps {
  data: IMessage;
  userID: number;
}

export default class MessageUnit extends React.Component<IMessageUnitProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const mess = this.props.data;
    const authorsMessage = (mess.AuthorID === this.props.userID);
    return(
      <div className={"message_" + (authorsMessage ? "my" : "alien")}>
        {(!authorsMessage ? <div className="message__author">{mess.AuthorName}</div> : <div/>)}
        <div className="message__content">{mess.Content.Message}</div>
      </div>
    );
  }
}
