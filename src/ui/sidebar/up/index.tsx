import * as React from "react";
import { observer, inject } from "mobx-react";
import NewButton from "./new";
require("./styles.scss");

interface ISideBarSearchProps {
  onChange: (word: string) => void;
}

@inject("store")
@observer
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
        <input onChange={this.change} placeholder="Search..."/>
        <NewButton onClick={() => {/* */}}/>
      </div>
    );
  }
}
