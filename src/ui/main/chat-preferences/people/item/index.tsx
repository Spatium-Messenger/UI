import * as React from "react";
import { observer, inject } from "mobx-react";
import { IChatUser } from "src/models/chat";
require("./styles.scss");

interface IPeopleItemProps {
 user: IChatUser;
}

export default class PeopleItem extends React.Component<IPeopleItemProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="people_item">
        <div>
          {this.props.user.Name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          {this.props.user.Name}
        </div>
      </div>
    );
  }
}
