import * as React from "react";
import Store from "src/store";

import { IAPI } from "src/interfaces/api";
import {IRootStore} from "src/store/interfeces";
import { render } from "react-dom";
import { observer, inject, Provider } from "mobx-react";

import { ICookie } from "src/interfaces/cookie";

import { IWebSocket } from "src/interfaces/web-socket";
import { ILocalStorage } from "src/interfaces/local-storage";
import { Messenger } from "./messenger";

require("./main.scss");

let store: IRootStore ;
export default class UI {
  private remoteAPI: IAPI;
  private cookie: ICookie;
  private websocket: IWebSocket;
  private storage: ILocalStorage;
  private openLink: (link: string, name: string) => void;

  constructor(
    remoteAPI: IAPI,
    cookieController: ICookie,
    websocket: IWebSocket,
    storage: ILocalStorage,
    openLink: (link: string, name: string) => void,
  ) {
    this.remoteAPI = remoteAPI;
    this.cookie = cookieController;
    this.websocket = websocket;
    this.storage = storage;
    this.openLink = openLink;
    store = new Store(remoteAPI, cookieController, websocket, storage, openLink);
  }

  public Render() {
    render(
      <main>
         <Provider store={store}>
          <Messenger />
        </Provider>
      </main>
      ,
      document.getElementById("root"),
    );
  }
}
