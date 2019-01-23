import * as React from "react";
import { observer, inject } from "mobx-react";
require("./styles.scss");

interface IWindowContentProps {
}

@inject("store")
@observer
export default class WindowContent extends React.Component<IWindowContentProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="window__content">
        WindowContent
      </div>
    );
  }
}
