import * as React from "react";
import { observer, inject } from "mobx-react";
import { IRootStore } from "src/ui/store/interfeces";
import ChatPreferencesUp from "./up";
import ChatPreferencesPeople from "./people";
import Loader from "src/ui/components/loader";
import { IChat } from "src/models/chat";
import languages from "src/language";
require("./styles.scss");

const exitIcon: string = require("assets/exit.svg");
const back: string = require("assets/back-arrow.svg");
const arhive: string = require("assets/archive-black-box.svg");

interface IChatPreferencesProps {
  store?: IRootStore;
}

export default inject("store")(observer((props: IChatPreferencesProps) => {
  if (props.store.chatStore.currentChatID === -1) {
    return(<div/>);
  }

  const lang = languages.get(props.store.userStore.data.lang).chatPreferences;
  // const userID = props.store.userStore.data.ID;
  const chatID = props.store.chatStore.currentChatID;
  const messagesInfo = props.store.messagesStore.messages.get(chatID);
  const currentChat: IChat | null = props.store.chatStore.getChatData(chatID);

  const classname = "chat-preferences" + (props.store.appStore.chatMenu ? "-open" : "-close");
  if (!messagesInfo || messagesInfo.loading) {
    return <div className={classname + "-loading"}>
            <div className="chat-preferences-loader">
              <Loader/>
            </div>
          </div>;
  }

  if (currentChat && currentChat.Deleted) {
    const returnToChat = () => props.store.chatStore.turnBackToChat(chatID);
    const deleteFromList = () => props.store.chatStore.deleteChatFromList(chatID);
    const turnBack = (currentChat.Banned ? <div/> :
      <div className="chat-preferences__return-to-chat" onClick={returnToChat}>
        <div dangerouslySetInnerHTML={{__html: back}}/>
        <div>{lang.turnBackToChat}</div>
      </div>
    );
    return <div className={classname}>
     <ChatPreferencesUp />
     {turnBack}
      <div className="chat-preferences__delete_from_list" onClick={deleteFromList}>
        <div dangerouslySetInnerHTML={{__html: arhive}}/>
        <div>{lang.deleteFromList}</div>
      </div>
    </div>;
  }

  const deleteFromChat = () => props.store.chatStore.leaveChat(chatID);

  return(
    <div className={classname}>
      <ChatPreferencesUp />
      <ChatPreferencesPeople />
      <div className="chat-preferences__exit" onClick={deleteFromChat}>
        <div dangerouslySetInnerHTML={{__html: exitIcon}}/>
        <div>{lang.deleteFromChat}</div>
      </div>
    </div>
  );
}));
