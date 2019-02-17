import * as React from "react";
import { observer, inject } from "mobx-react";
require("./styles.scss");
const icon = require("assets/menu-button.svg");

interface ISideBarMenuButtonProps {
  onClick: () => void;
}

@inject("store")
@observer
export default class SideBarMenuButton extends React.Component<ISideBarMenuButtonProps> {
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
