import * as React from "react";
import { observer, inject } from "mobx-react";
import { IMessage, IMessageType } from "src/models/message";
import DocMessage from "./doc";
require("./styles.scss");

interface IMessageUnitProps {
  data: IMessage;
  userID: number;
  lastAuthorID: number;
  audioBuffers: Map<string, {el: HTMLAudioElement, d: number}>;
  getImage: (fileID: number, ext: string) => Promise<string>;
  downloadFile: (fileID: number,  name: string) => void;
  getAudio(fileID: number): Promise<{duration: number, blob: Blob} | {result: string}>;
}

export default class MessageUnit extends React.Component<IMessageUnitProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const mess = this.props.data;
    const showAuthorName = (this.props.lastAuthorID !== mess.AuthorID);

    if (mess.Content.Type === IMessageType.System) {
      return (
      <div className={"system-message"}>
        <div className="system-message__content">{mess.AuthorName}{mess.Content.Message}</div>
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
        key={d.ID}
      />,
      );
    return(
      <div className={"message-wrapper"}>
        <div className="message">
          {(showAuthorName ? <div className="message__author">{mess.AuthorName}</div> : <div/>)}
          {docs}
          <div className="message__content">{mess.Content.Message}</div>
        </div>
      </div>
    );
  }
}
