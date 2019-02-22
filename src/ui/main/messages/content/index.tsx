import * as React from "react";
import { observer, inject } from "mobx-react";
import IMessageUnit from "./message";
import { IRootStore } from "src/store/interfeces";
import { IMessageType } from "src/models/message";
require("./styles.scss");

interface IWindowContentProps {
  store?: IRootStore;
}

let MESSAGES_PAST = -1;
let CHAT_ID_PAST = -1;

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
    console.log(this.contentRef.current.scrollHeight);
    const chatID = this.props.store.chatStore.currentChat.ID;
    const messages = this.props.store.messagesStore.messages.get(chatID).messages;
    if (chatID !== CHAT_ID_PAST) {
      this.scroll(true);
    } else {
      this.scroll(false);
    }

    MESSAGES_PAST = messages.length;
    CHAT_ID_PAST = chatID;
  }

  public render() {
    const chatID = this.props.store.chatStore.currentChat.ID;
    const messages = this.props.store.messagesStore.messages.get(chatID).messages;

    const userID = this.props.store.userStore.data.ID;
    /*
      Messages order - [{time: 9:00},  {time: 9:05}, { time: 9:10}]
      First message - last sended message
    */
    const messagesComponents: JSX.Element[] = messages.map((v, i) => {
      let lastAuhtorID = (i === 0 ? -1 :  messages[i - 1].AuthorID);
      // If system message
      if (lastAuhtorID !== -1) {
        if (messages[i - 1].Content.Type !==  IMessageType.User) {
          lastAuhtorID = -1;
        }
      }
      // If message 1
      if (i === 0 && i === (messages.length - 1)) {
        lastAuhtorID =  -1;
      }

      return <IMessageUnit
        audioBuffers={this.props.store.fileStore.audioBuffers}
        getAudio={this.props.store.fileStore.getAudio}
        downloadFile={this.props.store.fileStore.downloadFile}
        getImage={this.props.store.fileStore.getImage}
        data={v}
        key={i}
        userID={userID}
        lastAuthorID={lastAuhtorID}
      />;
      });

    return(
      < div className="window__content" ref={this.contentRef} >
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
}
