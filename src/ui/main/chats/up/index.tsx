import * as React from "react";
import { observer, inject } from "mobx-react";
import SideBarMenuButton from "./menu";
require("./styles.scss");

interface ISideBarSearchProps {
  onChange: (word: string) => void;
  menu: () => void;
  placeholder: string;
}

export default class SideBarSearch extends React.Component<ISideBarSearchProps> {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
  }

  public change(n: React.FormEvent<HTMLInputElement>) {
    this.props.onChange(n.currentTarget.value);
  }

  public render() {
    return(
      <div className="sidebar__search">
        <SideBarMenuButton onClick={this.props.menu}/>
        <input onChange={this.change} placeholder={this.props.placeholder}/>
      </div>
    );
  }
}
