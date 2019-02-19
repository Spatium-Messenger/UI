import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
import ImageMessage from "./image";
import AudioMessage from "./audio";
require("./styles.scss");

const downloadIcon: string = require("assets/download.svg");

interface IDocMessageProps {
  doc: IMessageContentDoc;
  getImage: (fileID: number, ext: string) => Promise<string>;
  downloadFile: (fileID: number,  name: string) => void;
}

const EXTENSION_AUDIO = "wav";
const EXTENSION_IMAGE_JPG = "jpg";
const EXTENSION_IMAGE_JPEG = "jpeg";
const EXTENSION_IMAGE_PNG = "png";

export default class DocMessage extends React.Component<IDocMessageProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const dName: string = this.props.doc.Name;
    const fileExt: string = dName.slice((Math.max(0, dName.lastIndexOf(".")) || Infinity) + 1);
    switch (fileExt) {
      case EXTENSION_IMAGE_JPEG:
      case EXTENSION_IMAGE_JPG:
      case EXTENSION_IMAGE_PNG:
        return <ImageMessage
                  doc={this.props.doc}
                  getImage={this.props.getImage}
                  downloadFile={this.props.downloadFile}
        />;
      case EXTENSION_AUDIO:
        return <AudioMessage doc={this.props.doc}/>;
    }
    return(
      <div className="message-document">
        <div
          className="message-document__download"
          dangerouslySetInnerHTML={{__html: downloadIcon}}
        />
        <div>
          <div className="message-document__name">{this.props.doc.Name}</div>
          <div className="message-document__size">{this.size(this.props.doc.Size, 2)}</div>
        </div>
      </div>
    );
  }

  private size(bytes: number, point: number): string {
    if (bytes === 0) { return "0 B"; }
    const k = 1024;
    const dm = point <= 0 ? 0 : point || 2;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
