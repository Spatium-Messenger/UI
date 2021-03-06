import * as React from "react";
import { observer, inject } from "mobx-react";
import RootStore from "src/ui/store";
import MenuItem from "./item";
import { MODALS_ID } from "src/interfaces/store";
import languages from "src/language";
require("./styles.scss");

const messageIcon: string = require("assets/envelope.svg");
const backIcon: string = require("assets/back-arrow.svg");
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
    this.newChat = this.newChat.bind(this);
    this.newChannel = this.newChannel.bind(this);
    this.cache = this.cache.bind(this);
    this.close = this.close.bind(this);
    this.logout = this.logout.bind(this);
    this.lang = this.lang.bind(this);
    this.settings = this.settings.bind(this);
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
        <MenuItem colorClassName={"menu-item-icon-green"} icon={setIcon} text={CL.settings} click={this.settings}/>
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

  private cache() {
    this.close();
    this.props.store.appStore.changeModal(MODALS_ID.CACHE);
  }

  private settings() {
    this.close();
    this.props.store.appStore.changeModal(MODALS_ID.USER_SETTINGS);
  }

  private lang() {
    this.close();
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
