import * as React from "react";
import { observer, inject } from "mobx-react";
import {IAppStore} from "src/interfaces/store";
import SideBarSearch from "./search";
import SideBarItem from "./item";
import NewButton from "./new";

require("./styles.scss");

interface ISideBarProps {
  store?: {
    appStore: IAppStore;
  };
}

interface ISideBarState {
  search: string;
}

@inject("store")
@observer
export default class SideBar extends React.Component<ISideBarProps, ISideBarState> {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
    this.searchChange = this.searchChange.bind(this);
  }

  public searchChange(n: string) {
    this.setState({
      search: n,
    });
  }

  public render() {
    const search: string = this.state.search;
    const chats = this.props.store.appStore.chats.map(
      (value, i) => (
        (value.Name.indexOf(search) !== -1) ?
          <SideBarItem chat={value} key={i} /> : <div key={i}/>),
    );

    return(
      <div className="sidebar">
          <SideBarSearch onChange={this.searchChange}/>
          <div className="sidebar__items">
            {chats}
          </div>
          <NewButton onClick={() => {}}/>
      </div>
    );
  }
}
