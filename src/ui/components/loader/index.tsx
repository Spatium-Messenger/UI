import * as React from "react";
require("./styles.scss");

export default class Loader extends React.Component<{}> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="loader">
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    );
  }
}
