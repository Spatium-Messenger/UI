import * as React from "react";
import Store from "src/store";
// import { IRootStore } from "src/store/interfeces";
import SideBar from "./sidebar";
import Window from "./window";
import { Provider } from "mobx-react";

require("./styles.scss");

const store  = new Store();

export default class Messenger extends React.Component<{}> {
  constructor(props) {
    super(props);
  }
  public render() {
    return(
      <Provider store={store}>
        <div className="wrapper">
          <SideBar/>
          <Window/>
        </div>
      </Provider>
    );
  }
}
