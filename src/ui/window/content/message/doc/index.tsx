import * as React from "react";
require("./styles.scss");

interface IDocMessageProps {
}

export default class DocMessage extends React.Component<IDocMessageProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div> DocMessage </div>
    );
  }
}
