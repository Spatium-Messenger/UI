import * as React from "react";
import { observer, inject } from "mobx-react";
import SideBar from "./sidebar";
import Window from "./messages";
import WindowsHeader from "./messages/header";
import ChatMenu from "./chat-preferences";
require("./styles.scss");

@inject("store")
@observer
export default class Main extends React.Component<{}> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <div className="main-wrapper">
        <SideBar/>
        <div className="main-wrapper__left">
          <WindowsHeader/>
          <div className="main-wrapper__left__content">
            <Window/>
            <ChatMenu/>
          </div>
        </div>
      </div>
    );
  }
}
