import * as React from "react";
import { observer, inject } from "mobx-react";
require("./styles.scss");

interface ISideBarSearchProps {
  onChange: (word: string) => void;
}

@inject("store")
@observer
export default class SideBarSearch extends React.Component<ISideBarSearchProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="sidebar__search">
        <input />
      </div>
    );
  }
}
