import * as React from "react";
import Store from "src/store";
import SideBar from "./sidebar";
import Window from "./window";
import { Provider } from "mobx-react";
import { IAPI } from "src/interfaces/api";
import {IRootStore} from "src/store/interfeces";
import { render } from "react-dom";
import Sign from "./sign";

require("./styles.scss");
require("./main.scss");

let store: IRootStore ;

class Messenger extends React.Component<{}> {
  constructor(props) {
    super(props);
  }
  public render() {
    const content = (store.appStore.user.token === "" ?
      <Sign/> :
      <div className="wrapper">
        <SideBar/>
        <Window/>
      </div>);
    return(
      <Provider store={store}>
        {content}
      </Provider>
    );
  }
}

const CreateUI = function(remoteAPI: IAPI) {
  store = new Store(remoteAPI);
  render(
    <main>
      <Messenger />
    </main>
    ,
    document.getElementById("root"),
  );
};

export default CreateUI;
