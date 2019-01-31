import * as React from "react";
require("./styles.scss");

interface IImageMessageProps {
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
