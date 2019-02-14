import * as React from "react";
import { observer, inject } from "mobx-react";
require("./styles.scss");
const icon = require("assets/add.svg");

interface ISideBarNewButtonProps {
  onClick: () => void;
}

@inject("store")
@observer
export default class SideBarNewButton extends React.Component<ISideBarNewButtonProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
        <div
          className="sidebar__new-button"
          dangerouslySetInnerHTML={{__html: icon}}
          onClick={this.props.onClick}
        />
    );
  }
}
