import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
require("./styles.scss");

interface IImageMessageProps {
  doc: IMessageContentDoc;
}

export default class ImageMessage extends React.Component<IImageMessageProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div> ImageMessage </div>
    );
  }
}
