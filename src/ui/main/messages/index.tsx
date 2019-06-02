import * as React from "react";
import { observer, inject } from "mobx-react";
import WindowsContent from "./content";
import WindowsInput from "./input";
import { IRootStore } from "src/store/interfeces";
import { ILanguage } from "src/language/interface";
import languages from "src/language";
require("./styles.scss");

const worldIcon: string = require("assets/worlwide.svg");
const ban: string = require("assets/ban.svg");

interface IWindowProps {
  store?: IRootStore;
}

@inject("store")
@observer
export default class Window extends React.Component<IWindowProps> {
  constructor(props) {
    super(props);
  }
  public render() {
    const chatID = this.props.store.chatStore.currentChatID;
    const lang: ILanguage = languages.get(this.props.store.userStore.data.lang);
    if (chatID === -1) {
      return (
        <div className="window">
          <div className="window__empty">
            <div>
              <div
                dangerouslySetInnerHTML={{__html: worldIcon}}
              />
              <div>{lang.messages.choose}</div>
            </div>
          </div>
        </div>
      );
    }
    const chat = this.props.store.chatStore.getChatData(chatID);
    if (chat && chat.Delete) {
      return  <div className="window">
      <div className="window__empty"><div>
          <div
            dangerouslySetInnerHTML={{__html: ban}}
          />
          <div>{lang.messages.banned}</div>
      </div></div>
    </div>;
    }
    return(
      <div className="window">
        <WindowsContent/>
        <WindowsInput/>
      </div>
    );
    }
  }
