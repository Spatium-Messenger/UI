import * as React from "react";
import { IMessageContentDoc } from "src/models/message";
require("./styles.scss");

interface IAudioMessageProps {
  doc: IMessageContentDoc;
}

export default class AudioMessage extends React.Component<IAudioMessageProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div> AudioMessage </div>
    );
  }
}
