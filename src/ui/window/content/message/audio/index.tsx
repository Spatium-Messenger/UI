import * as React from "react";
require("./styles.scss");

interface IAudioMessageProps {
  //
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
