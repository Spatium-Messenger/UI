import * as React from "react";
import { observer, inject } from "mobx-react";
import RootStore from "src/store";
import MenuItem from "./item";
import { MODALS_ID } from "src/interfaces/store";
import languages from "src/language";
import { ILanguage } from "src/language/interface";
require("./styles.scss");

// const iconClose: string = require("assets/cancel.svg");
const messageIcon: string = require("assets/envelope.svg");
const backIcon: string = require("assets/back-arrow.svg");
const profileIcon: string = require("assets/user.svg");
const cacheIcon: string = require("assets/archive-black-box.svg");
const setIcon: string = require("assets/settings-work-tool.svg");
const exitIcon: string = require("assets/exit.svg");
const dialogIcon: string = require("assets/friends.svg");
const chanIcon: string = require("assets/rss-symbol.svg");

interface IUserMenuProps {
  store?: RootStore;
}

@inject("store")
@observer
export default class UserMenu extends React.Component<IUserMenuProps> {
  constructor(props) {
    super(props);
    this.newChat = this.newChat.bind(this);
    this.newChannel = this.newChannel.bind(this);
    this.cache = this.cache.bind(this);
    this.close = this.close.bind(this);
    this.logout = this.logout.bind(this);
    this.lang = this.lang.bind(this);
  }

  public render() {
    const lang = languages.get(this.props.store.userStore.data.lang);
    const CL = lang.menu;
    const login: string = this.props.store.userStore.data.login;
    return(
      <div className={"user-menu-" + (this.props.store.appStore.menu ? "open" : "close")}>
        <div className="user-menu__header">
          <div className="user-menu__header__avatar">
            {login.substring(0, 2).toUpperCase()}
          </div>
          <div className="user-menu__header__info">
            <div>{CL.signed} </div>
            <div>{login}</div>
          </div>
        </div>
        <div className="user-menu__body">
        <MenuItem colorClassName={"menu-item-icon-white"} icon={backIcon} text={CL.back} click={this.close}/>
        <MenuItem colorClassName={"menu-item-icon-blue"} icon={messageIcon} text={CL.newChat} click={this.newChat}/>
        <MenuItem colorClassName={"menu-item-icon-orange"} icon={chanIcon} text={CL.newChannel}click={this.newChannel}/>
        <MenuItem colorClassName={"menu-item-icon-green"} icon={profileIcon} text={CL.profile} click={this.profile}/>
        <MenuItem colorClassName={"menu-item-icon-pink"} icon={cacheIcon} text={CL.cache} click={this.cache}/>
        <MenuItem colorClassName={"menu-item-icon-yellow"} icon={setIcon} text={CL.settings} click={this.profile}/>
        <MenuItem colorClassName={"menu-item-icon-purple"} icon={exitIcon} text={CL.logout} click={this.logout}/>
        </div>
        <div className="user-menu__lang">
          <div
            dangerouslySetInnerHTML={{__html: lang.icon}}
            onClick={this.lang}
          />
        </div>
      </div>
    );
  }

  private close() {
    this.props.store.appStore.changeMenu(false);
  }

  private profile() {
    //
  }

  private cache() {
    this.close();
    this.props.store.appStore.changeModal(MODALS_ID.CACHE);
  }

  private settings() {
    //
  }

  private lang() {
    this.props.store.appStore.changeModal(MODALS_ID.LANGUAGE);
  }

  private logout() {
    this.props.store.appStore.changeMenu(false);
    this.props.store.userStore.logout();
  }

  private newChat() {
    this.close();
    this.props.store.appStore.changeModal(MODALS_ID.CREATE_CHAT);
  }

  private newChannel() {
    this.close();
    this.props.store.appStore.changeModal(MODALS_ID.CREATE_CHANNEL);
  }

}
