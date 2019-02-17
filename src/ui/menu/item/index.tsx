import * as React from "react";
import { observer, inject } from "mobx-react";
require("./styles.scss");

interface IMenuItemProps {
  icon: string;
  colorClassName?: string;
  text: string;
  click: () => void;
}

export default class MenuItem extends React.Component<IMenuItemProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="menu-item" onClick={this.props.click}>
        <div
          className={this.props.colorClassName}
          dangerouslySetInnerHTML={{__html: this.props.icon}}
        />
        <div>{this.props.text}</div>
      </div>
    );
  }
}
