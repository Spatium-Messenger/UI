import * as React from "react";
import { observer, inject } from "mobx-react";
import RootStore from "src/store";
import MenuItem from "./item";
require("./styles.scss");

// const iconClose: string = require("assets/cancel.svg");
const backIcon: string = require("assets/back-arrow.svg");
const profileIcon: string = require("assets/user.svg");
const cacheIcon: string = require("assets/archive-black-box.svg");
const setIcon: string = require("assets/settings-work-tool.svg");
const exitIcon: string = require("assets/exit.svg");

interface IUserMenuProps {
  store?: RootStore;
}

@inject("store")
@observer
export default class UserMenu extends React.Component<IUserMenuProps> {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.logout = this.logout.bind(this);
  }

  public close() {
    this.props.store.appStore.changeMenu(false);
  }

  public profile() {
    //
  }

  public cache() {
    //
  }

  public settings() {
    //
  }

  public logout() {
    this.props.store.appStore.changeMenu(false);
    this.props.store.userStore.logout();
  }

  public render() {
    const login: string = this.props.store.userStore.data.login;
    return(
      <div className={"user-menu-" + (this.props.store.appStore.menu ? "open" : "close")}>
        <div className="user-menu__header">
          <div className="user-menu__header__avatar">
            {login.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-menu__header__info">
            <div>SIGNED IN AS </div>
            <div>{login}</div>
          </div>
        </div>
        <div className="user-menu__body">
          <MenuItem colorClassName={"menu-item-icon-white"} icon={backIcon} text={"Back to Swap"} click={this.close}/>
          <MenuItem colorClassName={"menu-item-icon-green"} icon={profileIcon} text={"Profile"} click={this.profile}/>
          <MenuItem colorClassName={"menu-item-icon-pink"} icon={cacheIcon} text={"Cache"} click={this.profile}/>
          <MenuItem colorClassName={"menu-item-icon-yellow"} icon={setIcon} text={"Settings"} click={this.profile}/>
          <MenuItem colorClassName={"menu-item-icon-blue"} icon={exitIcon} text={"Log out"} click={this.logout}/>
        </div>
      </div>
    );
  }
}
