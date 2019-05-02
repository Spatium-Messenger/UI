import * as React from "react";
import { observer, inject } from "mobx-react";
import IMessageUnit from "./message";
import { IRootStore } from "src/store/interfeces";
import { IMessageType, IMessage } from "src/models/message";
import languages from "src/language";
import Loader from "src/ui/components/loader";
import { ILanguage } from "src/language/interface";
require("./styles.scss");

interface IWindowContentProps {
  store?: IRootStore;
}

let MESSAGES_PAST = -1;
let CHAT_ID_PAST = -1;
const SECONDS_IN_DAY = 86400;

@inject("store")
@observer
export default class WindowContent extends React.Component<IWindowContentProps> {
  private contentRef: React.RefObject<HTMLDivElement>;
  private innerRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.contentRef = React.createRef();
    this.innerRef = React.createRef();
  }

  public componentDidUpdate() {
    const chatID = this.props.store.chatStore.currentChatID;
    const messagesData = this.props.store.messagesStore.messages.get(chatID);
    if (!messagesData || messagesData.loading) {
      return;
    }
    const messages = messagesData.messages;
    if (chatID !== CHAT_ID_PAST) {
      this.scroll(true);
    } else {
      this.scroll(false);
    }

    MESSAGES_PAST = messages.length;
    CHAT_ID_PAST = chatID;
  }

  public render() {
    const chatID = this.props.store.chatStore.currentChatID;
    const messagesInfo = this.props.store.messagesStore.messages.get(chatID);
    if (!messagesInfo || messagesInfo.loading) {
      return(<div className="window__content" ref={this.contentRef} >
        <div className="window__content-loader-wrapper">
          <div className="window__content-loader">
            <Loader/>
          </div>
        </div>
      </div >);
    }
    const messages = messagesInfo.messages;
    const userID = this.props.store.userStore.data.ID;
    /*
      Messages order - [{time: 9:00},  {time: 9:05}, { time: 9:10}]
      First message - last sended message
    */
    let earlyMessage: IMessage = null;
    let key: number = 0;
    const messagesComponents: JSX.Element[] = [];
    messages.map((v, i) => {
      let lastAuhtorID = (i === 0 ? -1 :  messages[i - 1].AuthorID);
      // If system message
      if (lastAuhtorID !== -1) {
        earlyMessage = messages[i - 1];
        if (earlyMessage.Content.Type !==  IMessageType.User) {
          lastAuhtorID = -1;
        }
        if (v.Time - earlyMessage.Time > 60) {
          // IF messages were sended in different days
          if (Math.round(v.Time / SECONDS_IN_DAY) !== Math.round(earlyMessage.Time / SECONDS_IN_DAY)) {
            messagesComponents.push(
              <div className="date-message" key={key++}>
                <div>{this.getDate(v.Time)}</div>
              </div>,
            );
          }
          lastAuhtorID = -1;
        }
      }
      // If message 1
      if (i === 0 && i === (messages.length - 1)) {
        lastAuhtorID =  -1;
      }
      const lang: ILanguage = languages.get(this.props.store.userStore.data.lang);
      messagesComponents.push(<IMessageUnit
        audioBuffers={this.props.store.fileStore.audioBuffers}
        getAudio={this.props.store.fileStore.getAudio}
        downloadFile={this.props.store.fileStore.downloadFile}
        getImage={this.props.store.fileStore.getImage}
        data={v}
        key={key++}
        userID={userID}
        lastAuthorID={lastAuhtorID}
        messageLang={lang.messages}
      />);
    });

    return(
      <div className="window__content" ref={this.contentRef} >
        <div className="window__content-tmp"/>
        <div ref={this.innerRef} className="window__content__wrapper">
          {messagesComponents}
        </div>
      </div >);
  }

  private scroll(force: boolean) {
    const needScroll = this.contentRef.current.scrollHeight;
    const scrolledTop = this.contentRef.current.scrollTop;
    const messagesHeightSum = this.innerRef.current.offsetHeight;
    const wrapperHeight =  this.contentRef.current.offsetHeight;
    const formBottom = messagesHeightSum - scrolledTop - wrapperHeight;
    if (formBottom >= 100 && !force) {
      return;
    }
    this.contentRef.current.scrollTo(0, needScroll);
  }

  private getDate(unixTimestamp): string {
    const monthNames: string[] = languages.get(this.props.store.userStore.data.lang).messages.months;
    const now = new Date();
    /* convert to msec
	   subtract local time zone offset
	   get UTC time in msec */
    const gmtHours = -now.getTimezoneOffset() / 60;
    const then = new Date(1970, 0, 1); // Epoch
    then.setSeconds(unixTimestamp + gmtHours * 60 * 60);
    const yearOrmonth = (now.getMonth() === then.getMonth() && now.getFullYear() === then.getFullYear());
    return (yearOrmonth ?
      then.getDate().toString() + " " + monthNames[then.getMonth()] :
      then.getFullYear().toString()
    );
  }
}
