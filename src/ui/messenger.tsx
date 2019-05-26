import * as React from "react";
import Sign from "./sign";
import { observer, inject } from "mobx-react";
import Popups from "./popups";
import UserMenu from "./menu";
import Main from "./main";
import { IRootStore } from "src/store/interfeces";
require("./styles.scss");

interface IMessngerProps {
  store?: IRootStore;
}

@inject("store")
@observer
export class Messenger extends React.Component<IMessngerProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const content = (this.props.store.userStore.data.token === "" ?
      <Sign/> :
      <div className="wrapper">
        <UserMenu/>
        <Popups/>
        <Main/>
      </div>);
    return(
        <div>{content}</div>
    );
  }
}
