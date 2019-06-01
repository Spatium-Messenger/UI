import * as React from "react";
import { IMessage, IMessageType, IMessageSystemCommands } from "src/models/message";
import DocMessage from "./doc";
import { ILanguageMessagesWindow } from "src/language/interface";
require("./styles.scss");

interface IMessageUnitProps {
  data: IMessage;
  userID: number;
  lastAuthorID: number;
  audioBuffers: Map<string, {el: HTMLAudioElement, timeoff: Date}>;
  getImage: (fileID: number, ext: string) => Promise<string>;
  downloadFile: (fileID: number,  name: string) => void;
  messageLang: ILanguageMessagesWindow;
  getAudio(fileID: number): Promise<{link: string, timeoff: Date} | {result: string}>;
}

export default class MessageUnit extends React.Component<IMessageUnitProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const mess = this.props.data;
    const showAuthorName = (this.props.lastAuthorID !== mess.AuthorID);
    const lang: ILanguageMessagesWindow = this.props.messageLang;

    if (mess.Content.Type === IMessageType.System) {
      let content: string = "";
      switch (mess.Content.Command) {
        case IMessageSystemCommands.UserCreatedChat:
          content = lang.messageCommands.userCreatedChat;
          break;
        case IMessageSystemCommands.UserCreatedChannel:
          content = lang.messageCommands.userCreatedChannel;
          break;
        case IMessageSystemCommands.UserInsertedInChat:
          content = lang.messageCommands.userInvitedChat;
          break;
        case IMessageSystemCommands.UserInsertedToChannel:
          content = lang.messageCommands.userInvitedChannel;
          break;
      }
      return (
      <div className={"system-message"}>
        <div className="system-message__content">{mess.AuthorName} {content}</div>
      </div>
      );
    }

    const docs: JSX.Element[] = mess.Content.Documents.map((d, i) =>
      <DocMessage
        audioBuffers={this.props.audioBuffers}
        getAudio={this.props.getAudio}
        getImage={this.props.getImage}
        downloadFile={this.props.downloadFile}
        doc={d}
        key={d.Path}
      />,
      );
    const up = (!showAuthorName ? <div/> :
      <div className="message__up">
        <div className="message__author">{mess.AuthorName}</div>
        <div>{this.getTime(mess.Time)}</div>
      </div>);
    return(
      <div className={"message-wrapper"}>
        <div className="message">
          {up}
          {docs}
          <div className="message__content">{mess.Content.Message}</div>
        </div>
      </div>
    );
  }

  private getTime(unixTimestamp: number): string {
    // console.log();
    const d = new Date();
    /* convert to msec
	   subtract local time zone offset
	   get UTC time in msec */
    const gmtHours = -d.getTimezoneOffset() / 60;
    const then = new Date(1970, 0, 1); // Epoch
    then.setSeconds(unixTimestamp + gmtHours * 60 * 60);
    let final: string;
    const minutes = (then.getMinutes() < 10) ? "0" + then.getMinutes() : then.getMinutes();
    const  hours = (then.getHours() < 10) ? "0" + then.getHours() : then.getHours();
    final = hours + ":" + minutes;
    return final;

  }
}
