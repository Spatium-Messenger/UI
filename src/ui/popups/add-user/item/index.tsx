import * as React from "react";
import { observer, inject } from "mobx-react";
import { IChatUser } from "src/models/chat";
require("./styles.scss");

interface IAddUserrPopupItemProps {
  user: IChatUser;
  onClick: (id: number) => void;
}

export default class AddUserrPopupItem extends React.Component<IAddUserrPopupItemProps> {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  public click() {
    this.props.onClick(this.props.user.ID);
  }

  public render() {
    return(
      <div className="add-user-popup-item" onClick={this.click}>
        <div>
          {this.props.user.Name.substring(0, 1).toUpperCase()}
        </div>
        <div>
          {this.props.user.Name}
        </div>
        <div>
          {this.props.user.Login}
        </div>
      </div>
    );
  }
}
