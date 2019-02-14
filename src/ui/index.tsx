import * as React from "react";
import Store from "src/store";
import SideBar from "./sidebar";
import Window from "./window";
import { IAPI } from "src/interfaces/api";
import {IRootStore} from "src/store/interfeces";
import { render } from "react-dom";
import { observer, inject, Provider } from "mobx-react";
import Sign from "./sign";
import { IUserStore } from "src/interfaces/store";
import { ICookie } from "src/interfaces/cookie";
import Modals from "./modals";

require("./styles.scss");
require("./main.scss");

let store: IRootStore ;

interface IMessngerProps {
  store?: IRootStore;
}

@inject("store")
@observer
class Messenger extends React.Component<IMessngerProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const content = (this.props.store.userStore.data.token === "" ?
      <Sign/> :
      <div className="wrapper">
        <Modals/>
        <SideBar/>
        <Window/>
      </div>);
    return(
        <div>{content}</div>
    );
  }
}

const CreateUI = function(remoteAPI: IAPI, cookieController: ICookie) {
  store = new Store(remoteAPI, cookieController);
  render(
    <main>
       <Provider store={store}>
        <Messenger />
      </Provider>
    </main>
    ,
    document.getElementById("root"),
  );
};

export default CreateUI;
