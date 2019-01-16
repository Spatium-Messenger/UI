import * as React from "react";
import { observer, inject } from "mobx-react";
require("./styles.scss");

@inject("store")
@observer
export default class Window extends React.Component<{}> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="window"> Window </div>
    );
  }
}
